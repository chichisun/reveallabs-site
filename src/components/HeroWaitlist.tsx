"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function HeroWaitlist() {
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
    } catch {
      setError("We couldn't reach the server. Try again?");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="hero-waitlist-success" role="status">
        You&apos;re on the list. We&apos;ll be in touch — back to the kitchen.
      </p>
    );
  }

  return (
    <form className="hero-waitlist" onSubmit={onSubmit} noValidate>
      <div className="hero-waitlist-bar">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          aria-label="Email address"
          aria-invalid={!!error}
          disabled={submitting}
          className="hero-waitlist-input"
        />
        <button
          type="submit"
          className="btn btn-primary hero-waitlist-submit"
          disabled={submitting}
        >
          {submitting ? "Sending…" : "Join the waitlist"}
        </button>
      </div>
      {error && (
        <span className="hero-waitlist-error" role="alert">
          {error}
        </span>
      )}
    </form>
  );
}
