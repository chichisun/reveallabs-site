import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { NewsWidget } from "@/components/news/NewsWidget";
import { BLOG_TOPICS } from "@/lib/blog-topics";
import { getAllPosts, formatPublishDate } from "@/lib/blog";
import { SITE_URL } from "@/lib/site-config";
import { BlogV2Shell } from "@/components/blog-v2/BlogV2Shell";
import { SiteNav } from "@/components/home-v2/SiteNav";
import { HomeWaitlist } from "@/components/home-v2/HomeWaitlist";

export const metadata: Metadata = {
  title: "Restaurant Insights — reveal.",
  description:
    "Restaurant insights revealed. Vendor billing patterns, food cost math, POS migrations — what one operator finds while running the books.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Restaurant Insights — reveal.",
    description:
      "Restaurant insights revealed — what one operator finds while running the books.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

/**
 * Resolve the image URL for a post. Priority:
 *   1. Explicit heroImage in MDX frontmatter
 *   2. The post's topic pillar illustration (Higgsfield-generated)
 *   3. Operations pillar as final fallback
 */
function resolveCardImage(post: ReturnType<typeof getAllPosts>[number]): string {
  if (post.frontmatter.heroImage) return post.frontmatter.heroImage;
  if (post.topicMeta) return post.topicMeta.heroImage;
  return "/blog-pillars/operations.png";
}

// The morph headline's letters are server-rendered pre-spread (the mockup's
// initial state); BlogV2Shell settles them snug on load.
const MORPH_TEXT = "reveal.ed";

export default function BlogIndexPage() {
  const allPosts = getAllPosts();
  const total = allPosts.length;

  return (
    <>
      <BlogV2Shell>
        <SiteNav page="blog" />

        <main className="wrap">
          <header className="blog-header">
            <div className="chip chip--amber">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              Field notes
            </div>
            <h1>
              Restaurant insights,
              <br />
              <span className="morph">
                {[...MORPH_TEXT].map((ch, i) => (
                  <span
                    key={i}
                    className={`m-ch${ch === "." ? " m-dot" : ""}`}
                    style={{ transform: `translateX(${i * 7}px)` }}
                  >
                    {ch}
                  </span>
                ))}
              </span>
            </h1>
            <p className="blog-lede">
              Vendor billing patterns, food cost math, POS migrations — what
              one operator finds while running the books at Tuk Tuk in Denver,
              written up for anyone running their own.
            </p>
          </header>

          {/* Pinned, hourly-updated news widget (live Supabase data), styled
              as the mockup's .news-widget block via blog-v2.css. Renders
              nothing when there are no live items. */}
          <NewsWidget />

          {total === 0 && (
            <div className="blog-empty">
              <p>
                The first issue lands Friday. Drafts in the pipeline cover
                vendor billing audits and POS migrations — see you then.
              </p>
            </div>
          )}

          <nav className="topics-bar" aria-label="Filter by topic">
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
          </nav>

          {total > 0 && (
            <ul className="card-grid" aria-label="Earlier issues">
              {allPosts.map((post, i) => (
                <li key={post.frontmatter.slug}>
                  <Link
                    href={`/blog/${post.frontmatter.slug}`}
                    className="blog-card"
                    style={{ "--col-delay": `${(i % 3) * 120}ms` } as React.CSSProperties}
                  >
                    <div className="blog-card-image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={resolveCardImage(post)} alt="" loading="lazy" />
                    </div>
                    <div className="blog-card-text">
                      {post.topicMeta && (
                        <p className="blog-card-eyebrow">{post.topicMeta.label}</p>
                      )}
                      <h3 className="blog-card-title">{post.frontmatter.title}</h3>
                      <p className="blog-card-meta">
                        <time dateTime={post.frontmatter.publishDate}>
                          {formatPublishDate(post.frontmatter.publishDate)}
                        </time>
                        <span className="sep" aria-hidden="true">
                          ·
                        </span>
                        {post.readingTimeText}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </main>

        {/* Browse-by-topic (inset container, Supy-style) */}
        <section className="topics-section" aria-labelledby="browse-by-topic">
          <div className="topics-head reveal-in">
            <div className="chip chip--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Browse by topic
            </div>
            <h2 id="browse-by-topic">
              What I write about<span className="dot">.</span>
            </h2>
          </div>
          <div className="topic-card-grid">
            {BLOG_TOPICS.map((topic, i) => (
              <Link
                key={topic.slug}
                href={`/blog/topics/${topic.slug}`}
                className="topic-card reveal-in"
                style={{ "--i": i % 4 } as React.CSSProperties}
              >
                <div className="topic-card-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={topic.heroImage} alt="" loading="lazy" />
                </div>
                <h3>{topic.label}</h3>
                <p>{topic.tagline}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="closer">
          <h2>Stop paying for other people&apos;s mistakes.</h2>
          <p className="sub">
            Join the waitlist and be first in line when Reveal opens up.
          </p>
          <HomeWaitlist source="blog_closer" />
        </section>
      </BlogV2Shell>

      <Footer />
    </>
  );
}
