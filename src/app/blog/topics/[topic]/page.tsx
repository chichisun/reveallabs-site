import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { SiteNav } from "@/components/home-v2/SiteNav";
import { HomeWaitlist } from "@/components/home-v2/HomeWaitlist";
import { ArticleShell } from "@/components/blog-v2/ArticleShell";
import {
  BLOG_TOPICS,
  getTopic,
  topicSlugs,
} from "@/lib/blog-topics";
import { getPostsByTopic, formatPublishDate } from "@/lib/blog";
import { SITE_URL } from "@/lib/site-config";

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
    <ArticleShell>
      <SiteNav page="blog" />

      <main className="wrap">
        <header className="blog-header">
          <Link href="/blog" className="chip chip--slate topic-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Field notes
          </Link>
          <h1>
            {topic.label}<span className="dot">.</span>
          </h1>
          <p className="blog-lede">{topic.tagline}</p>
        </header>

        <nav className="topics-bar" aria-label="Filter by topic">
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
        </nav>

        {posts.length === 0 ? (
          <div className="blog-empty">
            <p>
              No issues here yet. New articles in this topic will appear once
              published.
            </p>
          </div>
        ) : (
          <ul className="card-grid" aria-label={`${topic.label} issues`}>
            {posts.map((post, i) => (
              <li key={post.frontmatter.slug}>
                <Link
                  href={`/blog/${post.frontmatter.slug}`}
                  className="blog-card"
                  style={{ "--col-delay": `${(i % 3) * 120}ms` } as React.CSSProperties}
                >
                  <div className="blog-card-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.frontmatter.heroImage ?? topic.heroImage}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                  <div className="blog-card-text">
                    <p className="blog-card-eyebrow">{topic.label}</p>
                    <h3 className="blog-card-title">{post.frontmatter.title}</h3>
                    <p className="blog-card-meta">
                      <time dateTime={post.frontmatter.publishDate}>
                        {formatPublishDate(post.frontmatter.publishDate)}
                      </time>
                      <span className="sep" aria-hidden="true">·</span>
                      {post.readingTimeText}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <section className="closer">
        <h2>Stop paying for other people&apos;s mistakes.</h2>
        <p className="sub">
          Join the waitlist and be first in line when Reveal opens up.
        </p>
        <HomeWaitlist source="blog_topic_closer" />
      </section>

      <Footer />
    </ArticleShell>
  );
}
