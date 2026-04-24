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
          reveal. is a revenue-intelligence tool for restaurants. At this stage
          ({POLICY_EFFECTIVE_DATE}) we collect no data beyond what you
          explicitly send us by email. If you click "Join the waitlist," we
          receive your email address and subject line only. We do not use
          trackers, cookies, or analytics on your identity. We use Vercel
          Analytics for aggregate traffic metrics (page views, referrer,
          country — no personal data).
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
