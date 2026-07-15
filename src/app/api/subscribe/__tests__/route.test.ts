import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Mock site-config
// ---------------------------------------------------------------------------
vi.mock('../../../../lib/site-config', () => ({
  SITE_URL: 'https://www.reveallabs.co',
}));

// ---------------------------------------------------------------------------
// Supabase chainable mock
//
// subscribe route call chain:
//   db.from('subscribers').upsert(...).select(...).single()  → { data, error }
//   db.from('email_sends').insert(...)                       → (ignored)
// ---------------------------------------------------------------------------

const singleMock = vi.fn();
const selectAfterUpsertMock = vi.fn();
const upsertMock = vi.fn();
const insertMock = vi.fn();

// Default: successful upsert returning a pending subscriber
function resetSupabaseMocks() {
  singleMock.mockResolvedValue({
    data: {
      id: 'sub-uuid-1',
      email: 'test@example.com',
      confirmation_token: 'tok-abc',
      status: 'pending',
    },
    error: null,
  });
  selectAfterUpsertMock.mockReturnValue({ single: singleMock });
  upsertMock.mockReturnValue({ select: selectAfterUpsertMock });
  insertMock.mockResolvedValue({ data: null, error: null });
}

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(function () {
    return {
      from: vi.fn(function (table: string) {
        if (table === 'subscribers') {
          return { upsert: upsertMock };
        }
        if (table === 'email_sends') {
          return { insert: insertMock };
        }
        return {};
      }),
    };
  }),
}));

// ---------------------------------------------------------------------------
// Resend mock
// ---------------------------------------------------------------------------
const sendMock = vi.fn();

vi.mock('resend', () => ({
  Resend: vi.fn(function () {
    return {
      emails: { send: sendMock },
    };
  }),
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('/api/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetSupabaseMocks();
    // Set env vars so adminDb() doesn't throw
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
    process.env.RESEND_API_KEY = 're_test_key';
    // Default: send succeeds
    sendMock.mockResolvedValue({ data: { id: 'email-id-1' }, error: null });
  });

  // 1. Invalid email rejected
  it('rejects invalid email with 400', async () => {
    const { POST } = await import('../route');
    const req = new NextRequest('http://localhost/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid email.' });
    expect(upsertMock).not.toHaveBeenCalled();
  });

  // 2. Empty body rejected
  it('rejects unparseable body with 400', async () => {
    const { POST } = await import('../route');
    const req = new NextRequest('http://localhost/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'not json{{',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid request.' });
    expect(upsertMock).not.toHaveBeenCalled();
  });

  // 3. Empty email rejected
  it('rejects empty email with 400', async () => {
    const { POST } = await import('../route');
    const req = new NextRequest('http://localhost/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: '' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid email.' });
  });

  // 4. Valid email upserts pending subscriber and returns 200
  it('upserts pending subscriber and returns 200 ok', async () => {
    const { POST } = await import('../route');
    const req = new NextRequest('http://localhost/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', source: 'blog' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(upsertMock).toHaveBeenCalledOnce();
    const upsertPayload = upsertMock.mock.calls[0][0];
    expect(upsertPayload.email).toBe('test@example.com');
    expect(upsertPayload.status).toBe('pending');
    expect(typeof upsertPayload.confirmation_token).toBe('string');
    expect(upsertPayload.confirmation_token).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    // expires_at should be in the future
    expect(new Date(upsertPayload.confirmation_token_expires_at).getTime()).toBeGreaterThan(
      Date.now(),
    );
  });

  // 5. Email is lowercased and trimmed
  it('lowercases and trims email before upsert', async () => {
    const { POST } = await import('../route');
    const req = new NextRequest('http://localhost/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: '  TEST@EXAMPLE.COM  ' }),
    });
    await POST(req);
    expect(upsertMock).toHaveBeenCalledOnce();
    expect(upsertMock.mock.calls[0][0].email).toBe('test@example.com');
  });

  // 6. Already-confirmed silently succeeds without sending email
  it('silently returns 200 for already-confirmed subscriber without sending email', async () => {
    singleMock.mockResolvedValue({
      data: {
        id: 'sub-uuid-1',
        email: 'test@example.com',
        confirmation_token: 'tok-abc',
        status: 'confirmed',
      },
      error: null,
    });
    const { POST } = await import('../route');
    const req = new NextRequest('http://localhost/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendMock).not.toHaveBeenCalled();
  });

  // 7. Send failure is logged but doesn't 500 — email_sends insert called with 'failed'
  it('returns 200 even when Resend send fails; logs failed status to email_sends', async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: 'Resend down', name: 'send_error' } });
    const { POST } = await import('../route');
    const req = new NextRequest('http://localhost/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(insertMock).toHaveBeenCalledOnce();
    const insertPayload = insertMock.mock.calls[0][0];
    expect(insertPayload.status).toBe('failed');
    expect(insertPayload.recipient_email).toBe('test@example.com');
  });

  // 8. Successful send logs to email_sends with status 'sent'
  it('logs sent status to email_sends on happy path', async () => {
    const { POST } = await import('../route');
    const req = new NextRequest('http://localhost/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', source: 'blog' }),
    });
    await POST(req);
    expect(insertMock).toHaveBeenCalledOnce();
    const insertPayload = insertMock.mock.calls[0][0];
    expect(insertPayload.status).toBe('sent');
    expect(insertPayload.recipient_email).toBe('test@example.com');
    expect(insertPayload.send_type).toBe('subscribe_confirmation');
  });

  // 9. DB init failure returns 503
  it('returns 503 when env vars are missing (db init fails)', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const { POST } = await import('../route');
    const req = new NextRequest('http://localhost/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: 'Service unavailable.' });
  });
});
