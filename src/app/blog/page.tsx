import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "../../components/Footer";
import { BlogSubscribeBlock } from "../../components/BlogSubscribeBlock";
import { WaitlistDialog } from "../../components/WaitlistDialog";
import { BLOG_TOPICS } from "../../lib/blog-topics";
import { getAllPosts, formatPublishDate } from "../../lib/blog";
import { SITE_URL } from "../../lib/site-config";

export const metadata: Metadata = {
  title: "Field notes — reveal.",
  description:
    "Audits in public. Vendor billing patterns, food cost math, POS migrations — what one operator finds while running the books.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Field notes — reveal.",
    description: "Audits in public — what one operator finds while running the books.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

// Decorative placeholder images for grid cards when no heroImage is set yet.
// Cycles through brand-aligned existing assets.
const FALLBACK_HEROES = [
  "/our-story/2026-v2.jpg",
  "/our-story/2014-v2.jpg",
  "/our-story/2011-v2.jpg",
  "/our-story/1998-v2.jpg",
  "/our-story/1970-v2.jpg",
] as const;

function pickFallbackHero(slug: string): string {
  // Stable hash so each post always gets the same fallback.
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % FALLBACK_HEROES.length;
  return FALLBACK_HEROES[idx];
}

export default function BlogIndexPage() {
  const allPosts = getAllPosts();
  const total = allPosts.length;
  const featured = allPosts[0];
  const rest = allPosts.slice(1);

  return (
    <>
      <main className="blog-page">
        <div className="blog-page-inner">
          <header className="blog-page-header">
            <p className="blog-eyebrow">Field notes</p>
            <h1 className="blog-page-heading">
              Audits, in public<span className="blog-heading-dot">.</span>
            </h1>
          </header>

          {total === 0 && (
            <div className="blog-empty">
              <p>
                The first issue lands Friday. Drafts in the pipeline cover
                vendor billing audits and POS migrations — see you then.
              </p>
            </div>
          )}

          {featured && (
            <section
              className="blog-featured"
              aria-labelledby="featured-heading"
            >
              <div className="blog-featured-text">
                {featured.topicMeta && (
                  <Link
                    href={`/blog/topics/${featured.topicMeta.slug}`}
                    className="blog-featured-eyebrow"
                  >
                    Most recent · {featured.topicMeta.label}
                  </Link>
                )}
                <h2 id="featured-heading" className="blog-featured-title">
                  <Link href={`/blog/${featured.frontmatter.slug}`}>
                    {featured.frontmatter.title}
                  </Link>
                </h2>
                <p className="blog-featured-time">{featured.readingTimeText}</p>
                <div className="blog-featured-byline">
                  <span className="blog-featured-author">
                    {featured.frontmatter.author}
                  </span>
                  <span className="blog-featured-sep" aria-hidden="true">·</span>
                  <time dateTime={featured.frontmatter.publishDate}>
                    {formatPublishDate(featured.frontmatter.publishDate)}
                  </time>
                </div>
              </div>
              <Link
                href={`/blog/${featured.frontmatter.slug}`}
                className="blog-featured-image"
                aria-hidden="true"
                tabIndex={-1}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    featured.frontmatter.heroImage ??
                    pickFallbackHero(featured.frontmatter.slug)
                  }
                  alt=""
                  loading="eager"
                />
              </Link>
            </section>
          )}

          <nav className="blog-topics-bar" aria-label="Filter by topic">
            <div className="blog-topics-bar-inner">
              <Link href="/blog" className="topic-link is-active">
                All
              </Link>
              {BLOG_TOPICS.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/blog/topics/${topic.slug}`}
                  className="topic-link"
                >
                  {topic.label}
                </Link>
              ))}
            </div>
          </nav>

          {rest.length > 0 && (
            <ul className="blog-card-grid" aria-label="Earlier issues">
              {rest.map((post) => (
                <li key={post.frontmatter.slug}>
                  <Link
                    href={`/blog/${post.frontmatter.slug}`}
                    className="blog-card"
                  >
                    <div className="blog-card-image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          post.frontmatter.heroImage ??
                          pickFallbackHero(post.frontmatter.slug)
                        }
                        alt=""
                        loading="lazy"
                      />
                    </div>
                    {post.topicMeta && (
                      <p className="blog-card-eyebrow">
                        {post.topicMeta.label}
                      </p>
                    )}
                    <h3 className="blog-card-title">
                      {post.frontmatter.title}
                    </h3>
                    <p className="blog-card-meta">
                      <time dateTime={post.frontmatter.publishDate}>
                        {formatPublishDate(post.frontmatter.publishDate)}
                      </time>
                      <span className="blog-meta-sep" aria-hidden="true">·</span>
                      {post.readingTimeText}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <BlogSubscribeBlock />
      <Footer />
      <WaitlistDialog />
    </>
  );
}
