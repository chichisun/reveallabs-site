import { WaitlistTrigger } from "./WaitlistTrigger";

/**
 * Subscribe / waitlist block surfaced at the bottom of every blog article
 * and on the blog index. Reuses the existing waitlist motion so there's
 * a single funnel — no separate "newsletter list" to manage in V1.
 *
 * Added 2026-05-01.
 */
export function BlogSubscribeBlock() {
  return (
    <aside className="blog-subscribe">
      <div className="blog-subscribe-inner">
        <p className="blog-subscribe-eyebrow">More like this</p>
        <h2 className="blog-subscribe-heading">
          Get the next article when it goes live.
        </h2>
        <p className="blog-subscribe-lede">
          One post a week. Vendor billing audits, food cost math, the boring
          spreadsheets that catch real money. No spam, no listicles, no
          founder-bragging.
        </p>
        <div className="blog-subscribe-actions">
          <WaitlistTrigger className="btn btn-primary blog-subscribe-cta">
            Join the waitlist
          </WaitlistTrigger>
          <a
            href="/blog/rss.xml"
            className="blog-subscribe-rss"
            aria-label="Subscribe via RSS"
          >
            RSS
          </a>
        </div>
      </div>
    </aside>
  );
}
