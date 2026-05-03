// src/app/blog/news/sources/page.tsx — public "What we monitor" page.
// Lists every source the engine pulls, separated by trust tier, with last
// successful pull as a freshness indicator.
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import {
  getAllSources,
  type PublicNewsSource,
} from "../../../../lib/news-db";
import { Footer } from "../../../../components/Footer";
import { SITE_URL } from "../../../../lib/site-config";

export const metadata: Metadata = {
  title: "What we monitor · Restaurant Insights — reveal.",
  description:
    "Every news source behind the Reveal news widget. Government feeds, trade publications, Denver outlets. Last successful pull and current health for each.",
  alternates: { canonical: `${SITE_URL}/blog/news/sources` },
};

const getCached = unstable_cache(async () => getAllSources(), ["news_sources"], {
  revalidate: 600,
  tags: ["news_sources"],
});

function relativeTime(iso: string | null): string {
  if (!iso) return "never";
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.round(h / 24)} d ago`;
}

function Section({
  title,
  items,
  blurb,
}: {
  title: string;
  items: PublicNewsSource[];
  blurb: string;
}) {
  return (
    <section style={{ marginBottom: 56 }}>
      <h2
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 28,
          fontWeight: 500,
          letterSpacing: "-0.5px",
          marginBottom: 8,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          color: "var(--charcoal-soft)",
          maxWidth: "60ch",
          marginBottom: 24,
        }}
      >
        {blurb}
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((s) => (
          <li
            key={s.id}
            style={{
              borderTop: "1px solid var(--stroke)",
              padding: "14px 0",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
            }}
          >
            <span style={{ fontWeight: 600 }}>{s.name}</span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--muted)",
              }}
            >
              {s.region} · {s.category}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: s.unhealthy ? "var(--error)" : "var(--muted)",
              }}
            >
              last pull {relativeTime(s.last_success_at)}
              {s.unhealthy ? " · UNHEALTHY" : ""}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function SourcesPage() {
  let sources: PublicNewsSource[] = [];
  try {
    sources = await getCached();
  } catch (err) {
    console.error("[SourcesPage] failed:", err);
  }
  const auto = sources.filter((s) => s.tier === "auto");
  const curated = sources.filter((s) => s.tier === "curated");

  return (
    <>
      <main className="blog-page">
        <div className="blog-page-inner">
          <header className="blog-page-header">
            <p className="blog-eyebrow">
              News reveal<span className="blog-heading-dot">.</span>ed
            </p>
            <h1 className="blog-page-heading">
              What we monitor<span className="blog-heading-dot">.</span>
            </h1>
            <p className="blog-page-lede">
              An hourly engine pulls every source below. Government and recall
              feeds publish to the news widget on capture. Trade publications
              and Denver outlets get a human eye before posting. Sources are
              added via CLI; this page is automatically rebuilt when health
              changes.
            </p>
          </header>
          <Section
            title="Auto-published feeds"
            items={auto}
            blurb="Government and recall feeds. The source IS the truth, so the engine rewrites the headline, adds a 'what to do' line, and publishes."
          />
          <Section
            title="Curated feeds (reviewed before posting)"
            items={curated}
            blurb="Trade publications and regional outlets. The engine drafts in Reveal voice, then queues for human review."
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
