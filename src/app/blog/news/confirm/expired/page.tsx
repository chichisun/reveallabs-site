import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Confirmation link expired — reveal. news",
  description: "Your confirmation link expired. Sign up again to get a new one.",
  robots: { index: false, follow: false },
};

export default function ConfirmExpiredPage() {
  return (
    <main className="news-confirm-page">
      <div className="news-confirm-card">
        <h1>That link expired.</h1>
        <p>
          Confirmation links last 24 hours. Sign up again and we&apos;ll send a
          fresh one.
        </p>
        <p>
          <Link href="/blog" className="news-confirm-link">
            Back to the blog →
          </Link>
        </p>
      </div>
    </main>
  );
}
