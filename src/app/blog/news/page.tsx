// src/app/blog/news/page.tsx — full archive of every live news item,
// grouped by ISO week, paginated.
import type { Metadata } from "next";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { getLiveItemsPaged, type PublicNewsItem } from "../../../lib/news-db";
import { Footer } from "../../../components/Footer";
import { NewsSubscribeDialog } from "../../../components/NewsSubscribeDialog";
import { NewsSubscribeTrigger } from "../../../components/NewsSubscribeTrigger";
import { SITE_URL } from "../../../lib/site-config";

export const metadata: Metadata = {
  title: "News · Restaurant Insights — reveal.",
  description:
    "Real-time restaurant industry news for indie operators. Auto-pulled from FDA, USDA, OSHA, BLS, trade publications, and Denver outlets.",
  alternates: { canonical: `${SITE_URL}/blog/news` },
};

const PAGE_SIZE = 25;

const getPage = unstable_cache(
  async (offset: number) => getLiveItemsPaged({ offset, limit: PAGE_SIZE }),
  ["news_archive"],
  { revalidate: 300, tags: ["news_items"] },
);

function isoWeek(iso: string): string {
  // ISO week-of-year per ISO 8601 (Mon-start, week 1 contains Jan 4).
  const d = new Date(iso);
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const week =
    1 +
    Math.round(
      ((d.getTime() - firstThursday.getTime()) / 86400000 -
        3 +
        ((firstThursday.getUTCDay() + 6) % 7)) /
        7,
    );
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function groupByWeek(items: PublicNewsItem[]): Map<string, PublicNewsItem[]> {
  const m = new Map<string, PublicNewsItem[]>();
  for (const i of items) {
    const k = isoWeek(i.published_at);
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(i);
  }
  return m;
}

export default async function NewsArchivePage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await props.searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));
  const offset = (page - 1) * PAGE_SIZE;

  let items: PublicNewsItem[] = [];
  let total = 0;
  try {
    const r = await getPage(offset);
    items = r.items;
    total = r.total;
  } catch (err) {
    console.error("[NewsArchive] failed:", err);
  }
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const grouped = groupByWeek(items);

  return (
    <>
      <main className="blog-page">
        <div className="blog-page-inner">
          <header className="blog-page-header">
            <p className="blog-eyebrow">
              News reveal<span className="blog-heading-dot">.</span>ed
            </p>
            <h1 className="blog-page-heading">
              Everything we surfaced<span className="blog-heading-dot">.</span>
            </h1>
            <p className="blog-page-lede">
              Hourly engine. Government feeds publish on capture. Trade
              publications and regional outlets are reviewed before posting.{" "}
              <Link
                href="/blog/news/sources"
                style={{
                  color: "inherit",
                  borderBottom: "1px solid currentColor",
                }}
              >
                What we monitor →
              </Link>
            </p>
          </header>

          {items.length === 0 && (
            <div className="blog-empty">
              <p>
                No items yet. The engine starts surfacing news once Supabase is
                provisioned and the first cron run completes.
              </p>
            </div>
          )}

          {[...grouped.entries()].map(([week, group]) => (
            <section key={week} style={{ marginBottom: "48px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: 18,
                }}
              >
                {week}
              </h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {group.map((item) => (
                  <li
                    key={item.id}
                    style={{
                      borderTop: "1px solid var(--stroke)",
                      padding: "18px 0",
                    }}
                  >
                    <Link
                      href={`/blog/news/${item.slug}`}
                      style={{ textDecoration: "none", color: "var(--charcoal)" }}
                    >
                      <h3
                        style={{
                          fontSize: 20,
                          fontWeight: 500,
                          letterSpacing: "-0.4px",
                          lineHeight: 1.25,
                          marginBottom: 6,
                        }}
                      >
                        {item.headline_friendly ?? item.headline_verbatim}
                      </h3>
                    </Link>
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--muted)",
                      }}
                    >
                      {item.region} · {item.category} · via {item.source_id} ·{" "}
                      {new Date(item.published_at)
                        .toISOString()
                        .slice(0, 10)
                        .replace(/-/g, ".")}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {totalPages > 1 && (
            <nav
              style={{
                marginTop: 32,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {page > 1 ? (
                <Link href={`/blog/news?page=${page - 1}`}>← Previous</Link>
              ) : (
                <span />
              )}
              <span>
                {page} / {totalPages}
              </span>
              {page < totalPages ? (
                <Link href={`/blog/news?page=${page + 1}`}>Next →</Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>
      </main>

      <section className="news-subscribe-callout">
        <div className="news-subscribe-callout-inner">
          <h2>Get this in your inbox.</h2>
          <p>
            One email when something useful happens. No drip. No padding.
          </p>
          <NewsSubscribeTrigger className="btn btn-primary">
            Subscribe to reveal. news
          </NewsSubscribeTrigger>
        </div>
      </section>

      <Footer />
      <NewsSubscribeDialog source="news-archive" />
    </>
  );
}
