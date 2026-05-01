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
import { getPostsByTopic, formatPublishDate } from "../../../../lib/blog";
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

// Card image resolution: explicit MDX heroImage > topic pillar illustration.

export default async function BlogTopicPage({ params }: Props) {
  const { topic: topicSlug } = await params;
  const topic = getTopic(topicSlug);
  if (!topic) notFound();

  const posts = getPostsByTopic(topic.slug);

  return (
    <>
      <main className="blog-page">
        <div className="blog-page-inner">
          <header className="blog-topic-page-header">
            <div className="blog-topic-page-text">
              <p className="blog-eyebrow">
                <Link href="/blog" className="blog-eyebrow-link">
                  ← Field notes
                </Link>
              </p>
              <h1 className="blog-page-heading">
                {topic.label}<span className="blog-heading-dot">.</span>
              </h1>
              <p className="blog-topic-page-tagline">{topic.tagline}</p>
            </div>
            <div className="blog-topic-page-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={topic.heroImage} alt="" loading="eager" />
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
            <ul className="blog-card-grid" aria-label={`${topic.label} issues`}>
              {posts.map((post) => (
                <li key={post.frontmatter.slug}>
                  <Link
                    href={`/blog/${post.frontmatter.slug}`}
                    className="blog-card"
                  >
                    <div className="blog-card-image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.frontmatter.heroImage ?? topic.heroImage}
                        alt=""
                        loading="lazy"
                      />
                    </div>
                    <p className="blog-card-eyebrow">{topic.label}</p>
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
