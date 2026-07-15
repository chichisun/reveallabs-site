import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Invalid confirmation link — reveal. news",
  description: "We couldn't find that confirmation. Sign up to get a fresh link.",
  robots: { index: false, follow: false },
};

export default function ConfirmInvalidPage() {
  return (
    <main className="news-confirm-page">
      <div className="news-confirm-card">
        <h1>We couldn&apos;t find that.</h1>
        <p>
          The confirmation link looks invalid or already used. If you think this
          is a mistake, try signing up again.
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
