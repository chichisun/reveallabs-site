// src/app/blog/news/review/done/page.tsx — confirmation after approve/reject.
import Link from "next/link";

export default async function DonePage(props: {
  searchParams: Promise<{ action?: string; slug?: string }>;
}) {
  const { action, slug } = await props.searchParams;
  return (
    <main
      style={{
        padding: 48,
        fontFamily: "var(--font-sans)",
        maxWidth: 560,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 500 }}>
        {action === "approve" ? "Approved." : "Rejected."}
      </h1>
      <p style={{ color: "var(--charcoal-soft)" }}>
        {action === "approve" ? (
          <>
            The item is live within 5 minutes.{" "}
            <Link
              href={slug ? `/blog/news/${slug}` : "/blog/news"}
              style={{ color: "var(--green-700)" }}
            >
              Open it →
            </Link>
          </>
        ) : (
          "Item killed. It will not be re-captured."
        )}
      </p>
    </main>
  );
}
