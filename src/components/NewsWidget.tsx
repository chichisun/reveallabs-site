// src/components/NewsWidget.tsx — pinned news widget on /blog (replaces
// the old featured-post section). Server component reading Supabase.
import Link from "next/link";
import { unstable_cache } from "next/cache";
import {
  getTopLiveItems,
  getMostRecentLiveAt,
  getAllSources,
} from "../lib/news-db";

const getCached = unstable_cache(
  async () => {
    const [items, lastAt, sources] = await Promise.all([
      getTopLiveItems(3),
      getMostRecentLiveAt(),
      getAllSources(),
    ]);
    return { items, lastAt, sourceCount: sources.length };
  },
  ["news_widget_top_3"],
  { revalidate: 300, tags: ["news_items"] },
);

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.round(diffMs / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.round(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

function regionLabel(r: string): string {
  return r === "denver" ? "Denver" : r === "colorado" ? "Colorado" : "National";
}

export async function NewsWidget() {
  let cached;
  try {
    cached = await getCached();
  } catch (err) {
    // If Supabase is misconfigured, render nothing rather than crashing /blog.
    console.error("[NewsWidget] failed to load:", err);
    return null;
  }
  const { items, lastAt, sourceCount } = cached;

  return (
    <section className="news-widget" aria-label="Pinned restaurant news">
      <div className="news-widget-header">
        <div className="news-eyebrow-row">
          <span className="news-widget-eyebrow">
            News reveal<span className="news-widget-dot">.</span>ed
          </span>
          <span className="news-widget-live">Live</span>
        </div>
        <div className="news-widget-meta">
          <span className="news-widget-updated">
            Updated{" "}
            <strong>{lastAt ? relativeTime(lastAt) : "—"}</strong> ·{" "}
            {sourceCount} sources monitored
          </span>
          <Link className="news-widget-monitor-link" href="/blog/news/sources">
            What we monitor →
          </Link>
        </div>
      </div>

      {items.length === 0 && (
        <div className="news-widget-empty">
          <p>
            The engine is monitoring {sourceCount} sources hourly. Items appear
            here as they are surfaced and reviewed.
          </p>
          <Link className="news-widget-see-all" href="/blog/news/sources">
            See what we monitor →
          </Link>
        </div>
      )}

      {items.map((item) => (
        <article key={item.id} className="news-widget-row">
          <div className="news-widget-row-meta">
            <span
              className={`news-widget-badge news-widget-badge-region ${item.region === "national" ? "is-national" : ""}`}
            >
              {regionLabel(item.region)}
            </span>
            <span
              className={`news-widget-badge news-widget-badge-tier ${item.tier === "curated" ? "is-curated" : ""}`}
            >
              {item.tier === "auto" ? "Auto" : "Curated"}
            </span>
          </div>
          <div>
            <h3 className="news-widget-headline">
              <Link href={`/blog/news/${item.slug}`}>
                {item.headline_verbatim}
              </Link>
            </h3>
            <p className="news-widget-block">
              <span className="news-widget-label">What it means</span>{" "}
              {item.what_it_means}
            </p>
            <p className="news-widget-block news-widget-todo">
              <span className="news-widget-label">What to do</span>{" "}
              {item.what_to_do}
            </p>
            <p className="news-widget-source">
              <span>via</span>{" "}
              <a href={item.source_url} target="_blank" rel="noreferrer">
                {item.source_id}
              </a>
              <span className="news-widget-source-sep">·</span>
              <time dateTime={item.published_at}>
                {new Date(item.published_at)
                  .toISOString()
                  .slice(0, 10)
                  .replace(/-/g, ".")}
              </time>
            </p>
          </div>
        </article>
      ))}

      <div className="news-widget-footer">
        <span className="news-widget-rhythm">
          Engine runs hourly. Auto items publish on capture; curated items
          reviewed before posting.
        </span>
        <Link className="news-widget-see-all" href="/blog/news">
          See all this week →
        </Link>
      </div>
    </section>
  );
}
