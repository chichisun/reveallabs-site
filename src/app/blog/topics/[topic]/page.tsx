import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "../../../../components/Footer";
import {
  BLOG_TOPICS,
  getTopic,
  topicSlugs,
} from "../../../../lib/blog-topics";
import {
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
    title: `${topic.label} — Blog — reveal.`,
    description: topic.tagline,
    alternates: { canonical: url },
    openGraph: {
      title: `${topic.label} — Blog — reveal.`,
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

  return (
    <>
      <header className="blog-header">
        <div className="blog-header-inner">
          <p className="blog-eyebrow">
            <Link href="/blog" className="blog-eyebrow-link">
              ← Blog
            </Link>
          </p>
          <h1 className="blog-heading">{topic.label}</h1>
          <p className="blog-lede">{topic.tagline}</p>
        </div>
      </header>

      <nav className="blog-topics-bar" aria-label="Filter by topic">
        <div className="blog-topics-bar-inner">
          <Link href="/blog" className="topic-chip">
            All
          </Link>
          {BLOG_TOPICS.map((t) => (
            <Link
              key={t.slug}
              href={`/blog/topics/${t.slug}`}
              className={`topic-chip${t.slug === topic.slug ? " is-active" : ""}`}
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
                No posts here yet. New articles in this topic will appear once
                published.
              </p>
              <p>
                <Link href="/blog">← Back to all posts</Link>
              </p>
            </div>
          ) : (
            <ul className="blog-card-grid">
              {posts.map((post) => (
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

      <Footer />
    </>
  );
}
