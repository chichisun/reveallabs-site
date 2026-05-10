import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Subscription confirmed — reveal. news",
  description: "You're on the list. The next issue lands in your inbox.",
  robots: { index: false, follow: false },
};

export default function ConfirmDonePage() {
  return (
    <main className="news-confirm-page">
      <div className="news-confirm-card">
        <div className="news-confirm-check" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="40"
            height="40"
            stroke="currentColor"
            strokeWidth="2.25"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1>You&apos;re on the list.</h1>
        <p>
          The next issue lands in your inbox when something useful happens. No
          drip, no newsletter padding.
        </p>
        <p>
          <Link href="/blog" className="news-confirm-link">
            Browse the latest →
          </Link>
        </p>
      </div>
    </main>
  );
}
