import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "../../../../components/Footer";
import { BlogSubscribeBlock } from "../../../../components/BlogSubscribeBlock";
import { WaitlistDialog } from "../../../../components/WaitlistDialog";
import {
  BLOG_TOPICS,
  getTopic,
  topicSlugs,
} from "../../../../lib/blog-topics";
import {
  getAllPosts,
  getPostsByTopic,
  formatPublishDate,
} from "../../../../lib/blog";
import { SITE_URL } from "../../../../lib/site-config";

type Props = {
  params: Promise<{ topic: string }>;
};

export async function generateStaticParams() {
  return topicSlugs().map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const topic = getTopic(topicSlug);
  if (!topic) return { title: "Not found — reveal." };
  const url = `${SITE_URL}/blog/topics/${topic.slug}`;
  return {
    title: `${topic.label} — Field notes — reveal.`,
    description: topic.tagline,
    alternates: { canonical: url },
    openGraph: {
      title: `${topic.label} — Field notes — reveal.`,
      description: topic.tagline,
      url,
      type: "website",
    },
  };
}

export default async function BlogTopicPage({ params }: Props) {
  const { topic: topicSlug } = await params;
  const topic = getTopic(topicSlug);
  if (!topic) notFound();

  const posts = getPostsByTopic(topic.slug);
  const allTotal = getAllPosts().length;

  return (
    <>
      <header className="blog-header">
        <div className="blog-header-inner">
          <p className="blog-eyebrow">
            <Link href="/blog" className="blog-eyebrow-link">
              ← Field notes
            </Link>
          </p>
          <h1 className="blog-heading">
            {topic.label}<span className="blog-heading-dot">.</span>
          </h1>
          <p className="blog-lede">{topic.tagline}</p>
        </div>
      </header>

      <nav className="blog-topics-bar" aria-label="Filter by topic">
        <div className="blog-topics-bar-inner">
          <Link href="/blog" className="topic-link">
            All
          </Link>
          {BLOG_TOPICS.map((t) => (
            <Link
              key={t.slug}
              href={`/blog/topics/${t.slug}`}
              className={`topic-link${t.slug === topic.slug ? " is-active" : ""}`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="blog-main">
        <div className="blog-main-inner">
          {posts.length === 0 ? (
            <div className="blog-empty">
              <p>
                No issues here yet. New articles in this topic will appear once
                published.
              </p>
              <p>
                <Link href="/blog">← Back to all field notes</Link>
              </p>
            </div>
          ) : (
            <ol className="blog-issue-list" aria-label={`${topic.label} issues`}>
              {posts.map((post) => {
                const allIdx = getAllPosts().findIndex(
                  (p) => p.frontmatter.slug === post.frontmatter.slug,
                );
                const issueNum = (allTotal - allIdx).toString().padStart(2, "0");
                return (
                  <li
                    key={post.frontmatter.slug}
                    className="blog-issue blog-issue--row"
                  >
                    <aside className="blog-issue-aside">
                      <span className="blog-issue-number">#{issueNum}</span>
                      <span className="blog-issue-date">
                        <time dateTime={post.frontmatter.publishDate}>
                          {formatPublishDate(post.frontmatter.publishDate)}
                        </time>
                      </span>
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
                );
              })}
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
