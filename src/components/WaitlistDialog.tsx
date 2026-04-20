"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Other components fire this event to open the dialog — no prop drilling,
// no context. Works from anywhere on the page.
export const WAITLIST_OPEN_EVENT = "waitlist:open";

type FormState = {
  name: string;
  restaurant: string;
  email: string;
};

const EMPTY: FormState = { name: "", restaurant: "", email: "" };

type Status = "idle" | "submitting" | "success" | "error";

export function WaitlistDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onOpen = () => {
      setStatus("idle");
      setServerError(null);
      setErrors({});
      setOpen(true);
    };
    window.addEventListener(WAITLIST_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(WAITLIST_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 100);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    window.setTimeout(() => {
      setForm(EMPTY);
      setStatus("idle");
      setServerError(null);
      setErrors({});
    }, 220);
  };

  const validate = (f: FormState): Partial<FormState> => {
    const e: Partial<FormState> = {};
    if (!f.name.trim()) e.name = "Your name, please.";
    if (!f.restaurant.trim()) e.restaurant = "Which restaurant?";
    if (!f.email.trim()) e.email = "Email, please.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
      e.email = "That doesn't look like an email.";
    return e;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setServerError(null);
    setStatus("submitting");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          restaurant: form.restaurant.trim(),
          email: form.email.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(
          (data && data.error) || "Something went wrong. Try again?",
        );
        setStatus("error");
        return;
      }
      setStatus("success");
      window.setTimeout(() => closeBtnRef.current?.focus(), 40);
    } catch {
      setServerError(
        "We couldn't reach the server. Check your connection and try again.",
      );
      setStatus("error");
    }
  };

  const submitting = status === "submitting";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="waitlist-scrim"
          role="dialog"
          aria-modal="true"
          aria-labelledby="waitlist-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <motion.div
            className="waitlist-card"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <button
              type="button"
              ref={closeBtnRef}
              onClick={close}
              className="waitlist-close"
              aria-label="Close"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            {status !== "success" ? (
              <>
                <div className="waitlist-eyebrow">Join the waitlist</div>
                <h3 id="waitlist-title" className="waitlist-title">
                  Tell us about your restaurant.
                </h3>
                <p className="waitlist-sub">
                  Three fields. We&apos;ll take it from here.
                </p>

                <form onSubmit={onSubmit} noValidate className="waitlist-form">
                  <label className="waitlist-field">
                    <span className="waitlist-label">Your name</span>
                    <input
                      ref={firstFieldRef}
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      aria-invalid={!!errors.name}
                      disabled={submitting}
                      className="waitlist-input"
                    />
                    {errors.name && (
                      <span className="waitlist-error">{errors.name}</span>
                    )}
                  </label>

                  <label className="waitlist-field">
                    <span className="waitlist-label">Restaurant name</span>
                    <input
                      type="text"
                      autoComplete="organization"
                      value={form.restaurant}
                      onChange={(e) =>
                        setForm({ ...form, restaurant: e.target.value })
                      }
                      aria-invalid={!!errors.restaurant}
                      disabled={submitting}
                      className="waitlist-input"
                    />
                    {errors.restaurant && (
                      <span className="waitlist-error">
                        {errors.restaurant}
                      </span>
                    )}
                  </label>

                  <label className="waitlist-field">
                    <span className="waitlist-label">Email</span>
                    <input
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      aria-invalid={!!errors.email}
                      disabled={submitting}
                      className="waitlist-input"
                    />
                    {errors.email && (
                      <span className="waitlist-error">{errors.email}</span>
                    )}
                  </label>

                  {serverError && (
                    <div
                      className="waitlist-error"
                      role="alert"
                      style={{ fontSize: 13 }}
                    >
                      {serverError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary waitlist-submit"
                    disabled={submitting}
                  >
                    {submitting ? "Sending…" : "Join the waitlist"}
                  </button>
                </form>
              </>
            ) : (
              <div className="waitlist-success">
                <div className="waitlist-check" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="waitlist-title">You&apos;re on the list.</h3>
                <p className="waitlist-sub">
                  We&apos;ll be in touch soon. Until then — back to the kitchen.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="btn btn-primary waitlist-submit"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
