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

function issueNumber(index: number, total: number): string {
  // Newest is highest issue number, counting up from #01.
  const n = total - index;
  return n.toString().padStart(2, "0");
}

export default function BlogIndexPage() {
  const allPosts = getAllPosts();
  const total = allPosts.length;
  const featured = allPosts[0];
  const rest = allPosts.slice(1);

  return (
    <>
      <header className="blog-header">
        <div className="blog-header-inner">
          <p className="blog-eyebrow">Field notes</p>
          <h1 className="blog-heading">
            Audits, in public<span className="blog-heading-dot">.</span>
          </h1>
          <p className="blog-lede">
            Vendor billing patterns, food cost math, POS migrations — what one
            operator finds while running the books at Tuk Tuk in Denver, written
            up for anyone running their own.
          </p>
        </div>
      </header>

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

      <main className="blog-main">
        <div className="blog-main-inner">
          {total === 0 && (
            <div className="blog-empty">
              <p>
                The first issue lands Friday. Drafts in the pipeline cover
                vendor billing audits and POS migrations — see you then.
              </p>
            </div>
          )}

          {featured && (
            <article className="blog-issue blog-issue--featured" aria-labelledby="issue-featured">
              <aside className="blog-issue-aside">
                <span className="blog-issue-number">
                  #{issueNumber(0, total)}
                </span>
                <span className="blog-issue-date">
                  <time dateTime={featured.frontmatter.publishDate}>
                    {formatPublishDate(featured.frontmatter.publishDate)}
                  </time>
                </span>
                {featured.topicMeta && (
                  <Link
                    href={`/blog/topics/${featured.topicMeta.slug}`}
                    className="blog-issue-topic"
                  >
                    {featured.topicMeta.label}
                  </Link>
                )}
              </aside>
              <div className="blog-issue-body">
                <h2 id="issue-featured" className="blog-issue-title">
                  <Link href={`/blog/${featured.frontmatter.slug}`}>
                    {featured.frontmatter.title}
                  </Link>
                </h2>
                <p className="blog-issue-lede">
                  {featured.frontmatter.metaDescription}
                </p>
                <p className="blog-issue-meta">
                  <Link
                    href={`/blog/${featured.frontmatter.slug}`}
                    className="blog-issue-cta"
                  >
                    Read it →
                  </Link>
                  <span className="blog-issue-meta-sep" aria-hidden="true">
                    ·
                  </span>
                  <span className="blog-issue-meta-time">
                    {featured.readingTimeText}
                  </span>
                </p>
              </div>
            </article>
          )}

          {rest.length > 0 && (
            <ol className="blog-issue-list" aria-label="Earlier issues">
              {rest.map((post, idx) => (
                <li key={post.frontmatter.slug} className="blog-issue blog-issue--row">
                  <aside className="blog-issue-aside">
                    <span className="blog-issue-number">
                      #{issueNumber(idx + 1, total)}
                    </span>
                    <span className="blog-issue-date">
                      <time dateTime={post.frontmatter.publishDate}>
                        {formatPublishDate(post.frontmatter.publishDate)}
                      </time>
                    </span>
                    {post.topicMeta && (
                      <Link
                        href={`/blog/topics/${post.topicMeta.slug}`}
                        className="blog-issue-topic"
                      >
                        {post.topicMeta.label}
                      </Link>
                    )}
                  </aside>
                  <div className="blog-issue-body">
                    <h3 className="blog-issue-title-row">
                      <Link href={`/blog/${post.frontmatter.slug}`}>
                        {post.frontmatter.title}
                      </Link>
                    </h3>
                    <p className="blog-issue-lede-row">
                      {post.frontmatter.metaDescription}
                    </p>
                    <p className="blog-issue-meta">
                      <span className="blog-issue-meta-time">
                        {post.readingTimeText}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </main>

      <BlogSubscribeBlock />
      <Footer />
      <WaitlistDialog />
    </>
  );
}
