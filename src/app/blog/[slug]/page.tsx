import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Footer } from "@/components/layout/Footer";
import { SiteNav } from "@/components/home-v2/SiteNav";
import { HomeWaitlist } from "@/components/home-v2/HomeWaitlist";
import { ArticleShell } from "@/components/blog-v2/ArticleShell";
import {
  getAllPostSlugs,
  getPostBySlug,
  formatPublishDate,
} from "@/lib/blog";
import { SITE_URL } from "@/lib/site-config";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not found — reveal." };
  const url = `${SITE_URL}/blog/${post.frontmatter.slug}`;
  return {
    title: `${post.frontmatter.title} — reveal.`,
    description: post.frontmatter.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.metaDescription,
      url,
      type: "article",
      publishedTime: new Date(post.frontmatter.publishDate).toISOString(),
      authors: [post.frontmatter.author],
      images: post.frontmatter.ogImage
        ? [{ url: post.frontmatter.ogImage }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.metaDescription,
      images: post.frontmatter.ogImage
        ? [post.frontmatter.ogImage]
        : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { frontmatter, content, readingTimeText, topicMeta } = post;

  return (
    <ArticleShell>
      <SiteNav page="blog" />

      <article className="article">
        <Link href="/blog" className="article-back reveal-in">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to field notes
        </Link>

        <header className="article-head reveal-in">
          <div className="article-meta">
            {topicMeta ? (
              <Link href={`/blog/topics/${topicMeta.slug}`} className="article-meta-topic">
                {topicMeta.label}
              </Link>
            ) : (
              <span className="article-meta-topic">Field notes</span>
            )}
            <span className="sep" aria-hidden="true">·</span>
            <span>By {frontmatter.author}</span>
            <span className="sep" aria-hidden="true">·</span>
            <time dateTime={frontmatter.publishDate}>
              {formatPublishDate(frontmatter.publishDate)}
            </time>
            <span className="sep" aria-hidden="true">·</span>
            <span>{readingTimeText}</span>
          </div>
          <h1 className="article-title">{frontmatter.title}</h1>
        </header>

        {frontmatter.heroImage && (
          <div className="article-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={frontmatter.heroImage} alt="" loading="eager" />
          </div>
        )}

        <div className="article-prose">
          <MDXRemote
            source={content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [
                    rehypeAutolinkHeadings,
                    {
                      behavior: "wrap",
                      properties: { className: "blog-heading-anchor" },
                    },
                  ],
                ],
              },
            }}
          />
        </div>

        <footer className="article-foot">
          <Link href="/blog" className="article-foot-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            All field notes
          </Link>
          {topicMeta && (
            <Link href={`/blog/topics/${topicMeta.slug}`} className="article-foot-link">
              More on {topicMeta.label}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </footer>
      </article>

      <section className="closer">
        <h2>Stop paying for other people&apos;s mistakes.</h2>
        <p className="sub">
          Join the waitlist and be first in line when Reveal opens up.
        </p>
        <HomeWaitlist source="blog_article_closer" />
      </section>

      <Footer />
    </ArticleShell>
  );
}
