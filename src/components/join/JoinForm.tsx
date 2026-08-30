"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

type Status = "idle" | "submitting" | "success";
type Errors = { name?: string; email?: string; why?: string };

const SOURCE_LABELS: Record<string, string> = {
  s2s: "Startups2Students · Boulder",
};

export function JoinForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [resumeLabel, setResumeLabel] = useState<string | null>(null);
  const [resumeNote, setResumeNote] = useState("PDF or Word · up to 5 MB");
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // ?from=s2s tells us the applicant came off the Boulder QR code. Read through
  // the framework hook so there is no hydration mismatch; JoinV2 wraps this
  // component in the <Suspense> boundary that requires.
  const params = useSearchParams();
  const fromParam = params.get("from");
  const source = fromParam ? SOURCE_LABELS[fromParam] || fromParam : null;

  const onFile = () => {
    const f = fileRef.current?.files?.[0];
    if (!f) {
      setResumeLabel(null);
      setResumeNote("PDF or Word · up to 5 MB");
      return;
    }
    if (f.size > MAX_RESUME_BYTES) {
      if (fileRef.current) fileRef.current.value = "";
      setResumeLabel(null);
      setResumeNote("That file is over 5 MB. Pick a smaller one.");
      return;
    }
    setResumeLabel(f.name);
    setResumeNote(`${(f.size / 1024 / 1024).toFixed(1)} MB · tap to change`);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const why = (data.get("why") || "").toString().trim();

    const next: Errors = {};
    if (!name) next.name = "Your name, please.";
    if (!email) next.email = "Email, please.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "That doesn't look like an email.";
    if (!why) next.why = "Tell me something. A couple of sentences is plenty.";
    setErrors(next);
    setServerError(null);
    if (Object.keys(next).length > 0) {
      const firstBad = form.querySelector<HTMLElement>('[aria-invalid="true"]');
      firstBad?.focus();
      return;
    }

    if (fromParam) data.set("from", fromParam);

    setStatus("submitting");
    try {
      const res = await fetch("/api/apply", { method: "POST", body: data });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body?.error || "Something went wrong. Try again?");
        setStatus("idle");
        return;
      }
      setFirstName(name.split(" ")[0]);
      setStatus("success");
    } catch {
      setServerError("Couldn't send that. Check your connection and try again.");
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className="join-done">
        <div className="join-tick" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12.5l5.2 5.2L20 7" />
          </svg>
        </div>
        <h3>Got it.</h3>
        <p>
          {`It's in Chayadol's inbox already, ${firstName}. You'll hear back from a person, not an autoresponder.`}
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} className="join-form" onSubmit={onSubmit} noValidate>
      {source ? (
        <p className="join-source">
          <span className="dot" aria-hidden="true" />
          {source}
        </p>
      ) : null}

      <div className={`join-field${errors.name ? " bad" : ""}`}>
        <label htmlFor="name">Your name</label>
        <input
          type="text"
          id="name"
          name="name"
          autoComplete="name"
          placeholder="First and last"
          required
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "err-name" : undefined}
        />
        {errors.name ? <p className="join-err" id="err-name">{errors.name}</p> : null}
      </div>

      <div className={`join-field${errors.email ? " bad" : ""}`}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          placeholder="you@school.edu"
          required
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "err-email" : undefined}
        />
        {errors.email ? <p className="join-err" id="err-email">{errors.email}</p> : null}
      </div>

      <div className="join-field">
        <label htmlFor="link">
          GitHub, or anything you&apos;ve built <span className="opt">Optional</span>
        </label>
        <input
          type="text"
          id="link"
          name="link"
          inputMode="url"
          placeholder="github.com/yourname"
        />
      </div>

      <div className="join-field">
        <label htmlFor="resume">
          Resume <span className="opt">Optional</span>
        </label>
        <label className={`join-drop${resumeLabel ? " has-file" : ""}`} htmlFor="resume">
          <input
            type="file"
            id="resume"
            name="resume"
            ref={fileRef}
            onChange={onFile}
            accept=".pdf,.doc,.docx"
          />
          <span className="join-drop-main">
            {resumeLabel ?? (
              <>
                Tap to add a file, or <u>choose one</u>
              </>
            )}
          </span>
          <span className="join-drop-sub">{resumeNote}</span>
        </label>
      </div>

      <div className={`join-field${errors.why ? " bad" : ""}`}>
        <label htmlFor="why">Why you</label>
        <textarea
          id="why"
          name="why"
          placeholder="A few sentences. What you've built, and why a restaurant's books are interesting to you."
          required
          aria-invalid={errors.why ? "true" : "false"}
          aria-describedby={errors.why ? "err-why" : undefined}
        />
        {errors.why ? <p className="join-err" id="err-why">{errors.why}</p> : null}
      </div>

      {/* Honeypot. Off-screen, not hidden, so bots fill it and people never see it. */}
      <div className="join-hp" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {serverError ? (
        <p className="join-err join-err--server" role="alert">
          {serverError}
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary join-submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send application"}
      </button>
      <p className="join-fineprint">
        Goes straight to Chayadol. You&apos;ll get a reply from a person.
      </p>
    </form>
  );
}
