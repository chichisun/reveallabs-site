/**
 * Blog content reader — reads MDX files from `src/content/blog/`, parses
 * frontmatter, and exposes typed helpers for listing/filtering.
 *
 * Posts live in `src/content/blog/<slug>.mdx`. Each post's frontmatter must
 * conform to `BlogFrontmatter` below. Build-time only; do NOT import this
 * from client components.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { BLOG_TOPICS, type BlogTopic } from "./blog-topics";

export type BlogStatus = "draft" | "published" | "archived";

export type BlogFrontmatter = {
  title: string;
  slug: string;
  publishDate: string; // ISO 8601 date
  metaDescription: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  ogImage?: string;
  heroImage?: string;
  author: string;
  topic: string; // must match a BLOG_TOPICS slug
  tags?: string[];
  status: BlogStatus;
};

export type BlogPost = {
  frontmatter: BlogFrontmatter;
  content: string; // raw MDX body (post-frontmatter)
  readingTimeMinutes: number;
  readingTimeText: string;
  topicMeta: BlogTopic | null;
};

const BLOG_CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog");

function readBlogDir(): string[] {
  if (!fs.existsSync(BLOG_CONTENT_DIR)) return [];
  return fs
    .readdirSync(BLOG_CONTENT_DIR)
    .filter((name) => name.endsWith(".mdx") || name.endsWith(".md"));
}

function parseBlogFile(filename: string): BlogPost | null {
  const fullPath = path.join(BLOG_CONTENT_DIR, filename);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const parsed = matter(raw);
  const data = parsed.data as Partial<BlogFrontmatter>;

  // Validate required fields
  const required: (keyof BlogFrontmatter)[] = [
    "title",
    "slug",
    "publishDate",
    "metaDescription",
    "author",
    "topic",
    "status",
  ];
  for (const key of required) {
    if (!data[key]) {
      console.warn(`[blog] ${filename}: missing required frontmatter field '${key}' — skipping`);
      return null;
    }
  }

  const fm = data as BlogFrontmatter;
  if (fm.status !== "published") return null; // only show published posts

  const topicMeta = BLOG_TOPICS.find((t) => t.slug === fm.topic) ?? null;
  if (!topicMeta) {
    console.warn(`[blog] ${filename}: unknown topic '${fm.topic}' — falling back to null`);
  }

  const stats = readingTime(parsed.content);

  return {
    frontmatter: fm,
    content: parsed.content,
    readingTimeMinutes: Math.ceil(stats.minutes),
    readingTimeText: stats.text,
    topicMeta,
  };
}

/**
 * Get all published posts, sorted newest first.
 */
export function getAllPosts(): BlogPost[] {
  const filenames = readBlogDir();
  const posts: BlogPost[] = [];
  for (const filename of filenames) {
    const post = parseBlogFile(filename);
    if (post) posts.push(post);
  }
  posts.sort(
    (a, b) =>
      new Date(b.frontmatter.publishDate).getTime() -
      new Date(a.frontmatter.publishDate).getTime(),
  );
  return posts;
}

/**
 * Get posts filtered by topic slug.
 */
export function getPostsByTopic(topicSlug: string): BlogPost[] {
  return getAllPosts().filter((p) => p.frontmatter.topic === topicSlug);
}

/**
 * Get a single post by its frontmatter slug.
 */
export function getPostBySlug(slug: string): BlogPost | null {
  const filenames = readBlogDir();
  for (const filename of filenames) {
    const post = parseBlogFile(filename);
    if (post?.frontmatter.slug === slug) return post;
  }
  return null;
}

/**
 * Get all slugs — used for generateStaticParams.
 */
export function getAllPostSlugs(): string[] {
  return getAllPosts().map((p) => p.frontmatter.slug);
}

/**
 * Group posts by topic, preserving topic-registry order. Topics with no
 * posts are omitted.
 */
export function getPostsGroupedByTopic(): Array<{
  topic: BlogTopic;
  posts: BlogPost[];
}> {
  const all = getAllPosts();
  return BLOG_TOPICS.map((topic) => ({
    topic,
    posts: all.filter((p) => p.frontmatter.topic === topic.slug),
  })).filter(({ posts }) => posts.length > 0);
}

/**
 * Format an ISO date string for human display.
 * Example: "May 2, 2026"
 */
export function formatPublishDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
