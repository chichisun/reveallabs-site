import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Supabase chainable mock
//
// confirm route call chain:
//   db.from('subscribers').select(...).eq(...).maybeSingle()  → { data, error }
//   db.from('subscribers').update(...).eq(...)                → (ignored)
// ---------------------------------------------------------------------------

const maybeSingleMock = vi.fn();
const eqAfterSelectMock = vi.fn();
const selectMock = vi.fn();

const eqAfterUpdateMock = vi.fn();
const updateMock = vi.fn();

// Default: valid pending subscriber, not expired
const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
const pastDate = new Date(Date.now() - 1000).toISOString();

function makeSubscriber(overrides: Record<string, unknown> = {}) {
  return {
    id: 'sub-uuid-1',
    email: 'test@example.com',
    status: 'pending',
    confirmation_token_expires_at: futureDate,
    resend_contact_id: null,
    ...overrides,
  };
}

function resetSupabaseMocks() {
  maybeSingleMock.mockResolvedValue({ data: makeSubscriber(), error: null });
  eqAfterSelectMock.mockReturnValue({ maybeSingle: maybeSingleMock });
  selectMock.mockReturnValue({ eq: eqAfterSelectMock });

  eqAfterUpdateMock.mockResolvedValue({ data: null, error: null });
  updateMock.mockReturnValue({ eq: eqAfterUpdateMock });
}

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(function () {
    return {
      from: vi.fn(function (_table: string) {
        // Both query paths use the same 'subscribers' table.
        // Return an object that supports both .select() and .update().
        return {
          select: selectMock,
          update: updateMock,
        };
      }),
    };
  }),
}));

// ---------------------------------------------------------------------------
// Resend mock
// ---------------------------------------------------------------------------
const contactsCreateMock = vi.fn();

vi.mock('resend', () => ({
  Resend: vi.fn(function () {
    return {
      contacts: { create: contactsCreateMock },
    };
  }),
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('/api/confirm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetSupabaseMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
    process.env.RESEND_API_KEY = 're_test_key';
    process.env.RESEND_AUDIENCE_ID = 'aud-uuid-1';
    // Default: contacts.create succeeds
    contactsCreateMock.mockResolvedValue({
      data: { id: 'contact-id-1' },
      error: null,
    });
  });

  // Helper: make a GET request with optional token
  function makeRequest(token?: string) {
    const url = token
      ? `http://localhost/api/confirm?token=${token}`
      : 'http://localhost/api/confirm';
    return new NextRequest(url);
  }

  // 1. Missing token redirects to status=invalid
  it('redirects to status=invalid when token is missing', async () => {
    const { GET } = await import('../route');
    const res = await GET(makeRequest());
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('status=invalid');
    expect(selectMock).not.toHaveBeenCalled();
  });

  // 2. No matching subscriber redirects to status=invalid
  it('redirects to status=invalid when no subscriber matches the token', async () => {
    maybeSingleMock.mockResolvedValue({ data: null, error: null });
    const { GET } = await import('../route');
    const res = await GET(makeRequest('nonexistent-token'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('status=invalid');
  });

  // 3. Already-confirmed redirects to status=already, Resend NOT called
  it('redirects to status=already for already-confirmed subscriber without calling Resend', async () => {
    maybeSingleMock.mockResolvedValue({
      data: makeSubscriber({ status: 'confirmed' }),
      error: null,
    });
    const { GET } = await import('../route');
    const res = await GET(makeRequest('tok-abc'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('status=already');
    expect(contactsCreateMock).not.toHaveBeenCalled();
  });

  // 4. Expired token redirects to status=expired, does NOT flip status
  it('redirects to status=expired for expired token without flipping subscriber status', async () => {
    maybeSingleMock.mockResolvedValue({
      data: makeSubscriber({ confirmation_token_expires_at: pastDate }),
      error: null,
    });
    const { GET } = await import('../route');
    const res = await GET(makeRequest('tok-expired'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('status=expired');
    expect(contactsCreateMock).not.toHaveBeenCalled();
    expect(updateMock).not.toHaveBeenCalled();
  });

  // 5. Valid token: flips status, creates Resend contact, redirects to status=ok
  it('flips status to confirmed, creates Resend contact, and redirects to status=ok', async () => {
    const { GET } = await import('../route');
    const res = await GET(makeRequest('tok-valid'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('status=ok');
    // Resend contacts.create called with correct args
    expect(contactsCreateMock).toHaveBeenCalledOnce();
    expect(contactsCreateMock.mock.calls[0][0]).toMatchObject({
      email: 'test@example.com',
      audienceId: 'aud-uuid-1',
      unsubscribed: false,
    });
    // Supabase update called with confirmed status
    expect(updateMock).toHaveBeenCalledOnce();
    const updatePayload = updateMock.mock.calls[0][0];
    expect(updatePayload.status).toBe('confirmed');
    expect(typeof updatePayload.confirmed_at).toBe('string');
    expect(updatePayload.resend_contact_id).toBe('contact-id-1');
  });

  // 6. Missing RESEND_AUDIENCE_ID: skips Resend but still flips status and redirects ok
  it('skips Resend contacts.create when RESEND_AUDIENCE_ID is unset, still confirms', async () => {
    delete process.env.RESEND_AUDIENCE_ID;
    const { GET } = await import('../route');
    const res = await GET(makeRequest('tok-valid'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('status=ok');
    expect(contactsCreateMock).not.toHaveBeenCalled();
    expect(updateMock).toHaveBeenCalledOnce();
    expect(updateMock.mock.calls[0][0].status).toBe('confirmed');
  });

  // 7. Resend contacts.create throws: status still flips to confirmed, redirect ok
  it('confirms subscriber even when Resend contacts.create throws', async () => {
    contactsCreateMock.mockRejectedValue(new Error('Resend network error'));
    const { GET } = await import('../route');
    const res = await GET(makeRequest('tok-valid'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('status=ok');
    expect(updateMock).toHaveBeenCalledOnce();
    expect(updateMock.mock.calls[0][0].status).toBe('confirmed');
  });

  // 8. DB init failure redirects to status=invalid
  it('redirects to status=invalid when env vars are missing (db init fails)', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const { GET } = await import('../route');
    const res = await GET(makeRequest('tok-valid'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('status=invalid');
  });
});
