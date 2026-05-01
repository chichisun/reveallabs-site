import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "../../components/Footer";
import { BlogSubscribeBlock } from "../../components/BlogSubscribeBlock";
import { BLOG_TOPICS } from "../../lib/blog-topics";
import {
  getAllPosts,
  getPostsGroupedByTopic,
  formatPublishDate,
} from "../../lib/blog";
import { SITE_URL } from "../../lib/site-config";

export const metadata: Metadata = {
  title: "Blog — reveal.",
  description:
    "Operator-credible writing for independent restaurant owners. Vendor billing audits, food cost math, POS migrations, the boring spreadsheets that catch real money.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog — reveal.",
    description:
      "Operator-credible writing for independent restaurant owners.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

export default function BlogIndexPage() {
  const allPosts = getAllPosts();
  const grouped = getPostsGroupedByTopic();
  const featured = allPosts[0]; // newest published

  return (
    <>
      <header className="blog-header">
        <div className="blog-header-inner">
          <p className="blog-eyebrow">Blog</p>
          <h1 className="blog-heading">
            Field notes for independent restaurants.
          </h1>
          <p className="blog-lede">
            Vendor billing audits. Food cost math. POS migrations. The boring
            spreadsheets that catch real money. Written by an operator, for
            operators.
          </p>
        </div>
      </header>

      <nav className="blog-topics-bar" aria-label="Filter by topic">
        <div className="blog-topics-bar-inner">
          <Link href="/blog" className="topic-chip is-active">
            All
          </Link>
          {BLOG_TOPICS.map((topic) => (
            <Link
              key={topic.slug}
              href={`/blog/topics/${topic.slug}`}
              className="topic-chip"
            >
              {topic.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="blog-main">
        <div className="blog-main-inner">
          {allPosts.length === 0 && (
            <div className="blog-empty">
              <p>
                The blog goes live with the first published article. The pipeline
                drafts blog posts every Friday — once one is reviewed and
                published, it&apos;ll appear here.
              </p>
            </div>
          )}

          {featured && (
            <section className="blog-featured" aria-labelledby="featured-heading">
              <h2 id="featured-heading" className="blog-section-heading">
                Latest
              </h2>
              <Link
                href={`/blog/${featured.frontmatter.slug}`}
                className={`blog-featured-card${featured.frontmatter.heroImage ? "" : " blog-featured-card--text-only"}`}
              >
                {featured.frontmatter.heroImage && (
                  <div className="blog-featured-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featured.frontmatter.heroImage}
                      alt=""
                      loading="eager"
                    />
                  </div>
                )}
                <div className="blog-featured-body">
                  {featured.topicMeta && (
                    <span className="blog-card-topic">
                      {featured.topicMeta.label}
                    </span>
                  )}
                  <h3 className="blog-featured-title">
                    {featured.frontmatter.title}
                  </h3>
                  <p className="blog-featured-desc">
                    {featured.frontmatter.metaDescription}
                  </p>
                  <p className="blog-card-meta">
                    {formatPublishDate(featured.frontmatter.publishDate)}
                    <span className="blog-meta-sep" aria-hidden="true">·</span>
                    {featured.readingTimeText}
                  </p>
                </div>
              </Link>
            </section>
          )}

          {grouped.map(({ topic, posts }) => (
            <section
              key={topic.slug}
              className="blog-topic-section"
              aria-labelledby={`topic-${topic.slug}`}
            >
              <div className="blog-topic-header">
                <h2 id={`topic-${topic.slug}`} className="blog-section-heading">
                  {topic.label}
                </h2>
                {posts.length > 3 && (
                  <Link
                    href={`/blog/topics/${topic.slug}`}
                    className="blog-section-link"
                  >
                    See all {posts.length}
                  </Link>
                )}
              </div>
              <p className="blog-topic-tagline">{topic.tagline}</p>
              <ul className="blog-card-grid">
                {posts.slice(0, 3).map((post) => (
                  <li key={post.frontmatter.slug}>
                    <Link
                      href={`/blog/${post.frontmatter.slug}`}
                      className="blog-card"
                    >
                      {post.frontmatter.heroImage && (
                        <div className="blog-card-image">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.frontmatter.heroImage}
                            alt=""
                            loading="lazy"
                          />
                        </div>
                      )}
                      <h3 className="blog-card-title">
                        {post.frontmatter.title}
                      </h3>
                      <p className="blog-card-desc">
                        {post.frontmatter.metaDescription}
                      </p>
                      <p className="blog-card-meta">
                        {formatPublishDate(post.frontmatter.publishDate)}
                        <span className="blog-meta-sep" aria-hidden="true">
                          ·
                        </span>
                        {post.readingTimeText}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>

      <BlogSubscribeBlock />
      <Footer />
    </>
  );
}
