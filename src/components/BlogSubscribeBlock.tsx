import { WaitlistTrigger } from "./WaitlistTrigger";

/**
 * Subscribe / waitlist block surfaced at the bottom of every blog page.
 * Reuses the existing waitlist motion — same audience as the product
 * waitlist, no separate newsletter list to manage.
 *
 * Copy intentionally avoids generic "join our newsletter" framing and
 * acknowledges the reader is signing up for the same thing the rest of
 * the site invites.
 */
export function BlogSubscribeBlock() {
  return (
    <aside className="blog-subscribe">
      <div className="blog-subscribe-inner">
        <p className="blog-subscribe-eyebrow">
          Read by operators<span className="blog-subscribe-dot">.</span>
        </p>
        <h2 className="blog-subscribe-heading">
          The next issue lands in your inbox if you&apos;re on the waitlist.
        </h2>
        <p className="blog-subscribe-lede">
          One operator&apos;s field notes. Not a newsletter, not a content
          drip. Same waitlist as the product, same people I&apos;m writing
          for first.
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
            <span aria-hidden="true">↗</span> RSS
          </a>
        </div>
      </div>
    </aside>
  );
}
