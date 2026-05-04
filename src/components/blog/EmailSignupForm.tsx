'use client';

import { useState, FormEvent } from 'react';

/**
 * Inline email signup form — submits to /api/subscribe (Phase B).
 *
 * Color tokens: matches the site's CSS variable palette.
 *   --charcoal  (#2E2E2E light / #ECEBE4 dark) — input border, button bg, text
 *   --muted     (#797979 light / #8E8B80 dark)  — placeholder text
 *
 * The button uses the same charcoal bg as the thermal-printer SVG so the
 * form reads as part of the ticket receipt rather than competing with the
 * green btn-primary hero CTA.
 */
export function EmailSignupForm({ source }: { source: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Something went wrong.');
      }
      setState('success');
      setEmail('');
    } catch (err) {
      setState('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (state === 'success') {
    return (
      <p className="text-[var(--charcoal)]">
        Check your inbox — we sent a confirmation link. (Click it within 24 hours.)
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@yourrestaurant.com"
        className="flex-1 rounded border border-[var(--charcoal)]/20 bg-transparent px-3 py-2 text-[var(--charcoal)] placeholder:text-[var(--muted)] focus:border-[var(--charcoal)] focus:outline-none"
        disabled={state === 'submitting'}
        aria-label="Email address"
      />
      <button
        type="submit"
        disabled={state === 'submitting'}
        className="rounded bg-[var(--charcoal)] px-4 py-2 text-[var(--cream)] disabled:opacity-50"
      >
        {state === 'submitting' ? 'Sending…' : 'Subscribe'}
      </button>
      {state === 'error' && (
        <p className="text-sm text-red-600 sm:basis-full" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
