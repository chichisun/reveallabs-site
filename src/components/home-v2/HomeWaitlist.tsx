"use client";

import { useState } from "react";
import { track, identify } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The mockup's dummy `<form class="waitlist">` pill, wired to the real
 * /api/waitlist endpoint (same logic as the previous HeroWaitlist component).
 * Markup and classes match the mockup exactly so the ported .waitlist styles
 * apply unchanged.
 */
export function HomeWaitlist({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const submitting = status === "submitting";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();

    if (!value) {
      setError("Email, please.");
      return;
    }
    if (!EMAIL_RE.test(value)) {
      setError("That doesn't look like an email.");
      return;
    }

    setError(null);
    setStatus("submitting");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data && data.error) || "Something went wrong. Try again?");
        setStatus("error");
        return;
      }
      setStatus("success");
      track("waitlist_submitted", { source }).catch(() => {});
      identify(value, { signup_type: "waitlist" }).catch(() => {});
    } catch {
      setError("We couldn't reach the server. Try again?");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="hv2-waitlist-success" role="status">
        You&apos;re on the list. We&apos;ll be in touch.
      </p>
    );
  }

  return (
    <>
      <form className="waitlist" onSubmit={onSubmit} noValidate>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Your email"
          aria-label="Email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          aria-invalid={!!error}
          disabled={submitting}
        />
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Sending…" : "Join the waitlist  →"}
        </button>
      </form>
      {error && (
        <span className="hv2-waitlist-error" role="alert">
          {error}
        </span>
      )}
    </>
  );
}
