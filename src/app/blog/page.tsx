import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "../../components/Footer";
import { BlogSubscribeBlock } from "../../components/BlogSubscribeBlock";
import { WaitlistDialog } from "../../components/WaitlistDialog";
import { BLOG_TOPICS } from "../../lib/blog-topics";
import { getAllPosts, formatPublishDate } from "../../lib/blog";
import { SITE_URL } from "../../lib/site-config";

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

export default function BlogIndexPage() {
  const allPosts = getAllPosts();
  const total = allPosts.length;

  return (
    <>
      <main className="blog-page">
        <div className="blog-page-inner">
          <header className="blog-page-header">
            <p className="blog-eyebrow">Field notes</p>
            <h1 className="blog-page-heading">
              Restaurant Insights reveal
              <span className="blog-heading-dot">.</span>ed
            </h1>
            <p className="blog-page-lede">
              Vendor billing patterns, food cost math, POS migrations — what one
              operator finds while running the books at Tuk Tuk in Denver,
              written up for anyone running their own.
            </p>
          </header>

          {total === 0 && (
            <div className="blog-empty">
              <p>
                The first issue lands Friday. Drafts in the pipeline cover
                vendor billing audits and POS migrations — see you then.
              </p>
            </div>
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

          {allPosts.length > 0 && (
            <ul className="blog-card-grid" aria-label="Issues">
              {allPosts.map((post) => (
                <li key={post.frontmatter.slug}>
                  <Link
                    href={`/blog/${post.frontmatter.slug}`}
                    className="blog-card"
                  >
                    <div className="blog-card-image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveCardImage(post)}
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

          {/* Browse-by-topic grid. Each topic has an editorial illustration
              of the operator-world objects it covers. Doubles as a useful
              navigation surface while the article archive is still small. */}
          <section
            className="blog-topics-section"
            aria-labelledby="browse-by-topic"
          >
            <header className="blog-topics-section-header">
              <p className="blog-eyebrow">Browse by topic</p>
              <h2
                id="browse-by-topic"
                className="blog-topics-section-heading"
              >
                What I write about<span className="blog-heading-dot">.</span>
              </h2>
            </header>
            <ul className="blog-topic-card-grid">
              {BLOG_TOPICS.map((topic) => (
                <li key={topic.slug}>
                  <Link
                    href={`/blog/topics/${topic.slug}`}
                    className="blog-topic-card"
                  >
                    <div className="blog-topic-card-image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={topic.heroImage} alt="" loading="lazy" />
                    </div>
                    <h3 className="blog-topic-card-label">{topic.label}</h3>
                    <p className="blog-topic-card-tagline">{topic.tagline}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <BlogSubscribeBlock />
      <Footer />
      <WaitlistDialog />
    </>
  );
}
