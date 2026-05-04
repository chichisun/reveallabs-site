"use client";

import { useState, FormEvent } from "react";

/**
 * Inline email signup form for the receipt-style subscribe block.
 * Stacks vertically (input above button) to fit the narrow ticket paper.
 * Submit reuses the site's liquid-glass `.btn .btn-primary` styling so it
 * reads as a sibling of the nav waitlist CTA.
 */
export function EmailSignupForm({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong.");
      }
      setState("success");
      setEmail("");
    } catch (err) {
      setState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  }

  if (state === "success") {
    return (
      <p className="subscribe-form-success" role="status">
        Check your inbox — we sent a confirmation link. Click it within 24 hours.
      </p>
    );
  }

  return (
    <form className="subscribe-form" onSubmit={onSubmit} noValidate>
      <label className="subscribe-form-label" htmlFor="subscribe-email">
        Email
      </label>
      <input
        id="subscribe-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@yourrestaurant.com"
        className="subscribe-form-input"
        disabled={state === "submitting"}
        autoComplete="email"
        inputMode="email"
        aria-label="Email address"
      />
      <button
        type="submit"
        disabled={state === "submitting" || email.length === 0}
        className="btn btn-primary subscribe-form-button"
      >
        {state === "submitting" ? "Sending…" : "Subscribe"}
      </button>
      {state === "error" && (
        <p className="subscribe-form-error" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
