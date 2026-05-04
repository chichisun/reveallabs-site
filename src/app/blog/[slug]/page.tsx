import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Footer } from "../../../components/Footer";
import { BlogSubscribeBlock } from "../../../components/BlogSubscribeBlock";
import { WaitlistDialog } from "../../../components/WaitlistDialog";
import {
  getAllPostSlugs,
  getPostBySlug,
  formatPublishDate,
} from "../../../lib/blog";
import { SITE_URL } from "../../../lib/site-config";

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
    <>
      <article className="blog-article">
        <div className="blog-article-top">
          <Link href="/blog" className="blog-article-back">
            <span className="blog-article-back-arrow" aria-hidden="true">←</span>
            Back to field notes
          </Link>
        </div>

        <div className="blog-article-meta-row">
          <span className="meta-left">
            {topicMeta ? (
              <Link href={`/blog/topics/${topicMeta.slug}`}>
                {topicMeta.label}
              </Link>
            ) : (
              <span>Field notes</span>
            )}
          </span>
          <span className="meta-mid">
            By <span className="meta-author">{frontmatter.author}</span>
            <span aria-hidden="true"> · </span>
            <time dateTime={frontmatter.publishDate}>
              {formatPublishDate(frontmatter.publishDate)}
            </time>
          </span>
          <span className="meta-right">{readingTimeText}</span>
        </div>

        <header className="blog-article-title-block">
          <h1 className="blog-article-title">{frontmatter.title}</h1>
        </header>

        {frontmatter.heroImage && (
          <div className="blog-article-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={frontmatter.heroImage} alt="" loading="eager" />
          </div>
        )}

        <div className="blog-article-prose">
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

        <footer className="blog-article-footer">
          <div className="blog-article-footer-inner">
            <Link href="/blog" className="blog-back-link">
              ← All field notes
            </Link>
            {topicMeta && (
              <Link
                href={`/blog/topics/${topicMeta.slug}`}
                className="blog-back-link"
              >
                More on {topicMeta.label} →
              </Link>
            )}
          </div>
        </footer>
      </article>

      <BlogSubscribeBlock />
      <Footer />
      <WaitlistDialog />
    </>
  );
}
