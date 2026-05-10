import Link from "next/link";
import type { Metadata } from "next";
import { POLICY_EFFECTIVE_DATE } from "../../lib/site-config";

export const metadata: Metadata = {
  title: "Privacy — reveal.",
  description:
    "Privacy policy for reveal., a revenue-intelligence tool for restaurants.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-6 px-8 py-16">
        <h1 className="text-4xl font-semibold tracking-tight text-charcoal">
          Privacy
        </h1>
        <p className="text-lg leading-relaxed text-charcoal-soft">
          reveal. is a revenue-intelligence tool for restaurants. As of{" "}
          {POLICY_EFFECTIVE_DATE}, here is what we collect and why.
        </p>
        <p className="text-lg leading-relaxed text-charcoal-soft">
          <strong>What you send us directly.</strong> If you join the waitlist,
          we receive the name, restaurant name, and email you submit. If you
          subscribe to reveal. news, we receive your email. We use these only
          to contact you about reveal. and the news feed you signed up for.
        </p>
        <p className="text-lg leading-relaxed text-charcoal-soft">
          <strong>Aggregate site analytics.</strong> We use Vercel Analytics
          (page views, referrer, country — no personal data) and PostHog
          (anonymous event tracking — page views, modal opens, form
          submissions). PostHog persistence is memory-only — no cross-session
          cookies, no session recording. We identify visitors by email only
          after they submit a form to us, so we can attribute which content
          led to which sign-up. You can request deletion of your analytics
          record by emailing the address below.
        </p>
        <p className="text-lg leading-relaxed text-charcoal-soft">
          <strong>What we do not do.</strong> We do not use cross-session
          tracking cookies. We do not record sessions or replay video of your
          activity. We do not sell your data. We do not share your data with
          third parties beyond the analytics processors named above.
        </p>
        <p className="text-lg leading-relaxed text-charcoal-soft">
          Questions:{" "}
          <a
            href="mailto:chayadol@reveallabs.co"
            className="text-green-700 underline-offset-4 hover:underline"
          >
            chayadol@reveallabs.co
          </a>
          .
        </p>
      </main>

      <footer className="px-8 py-8">
        <Link href="/" className="text-sm text-muted hover:text-charcoal">
          ← Back to home
        </Link>
      </footer>
    </div>
  );
}
