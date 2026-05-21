import type { MetadataRoute } from "next";
import { SITE_URL, SITE_LAST_MODIFIED } from "@/lib/site-config";
import { getAllPosts } from "@/lib/blog";
import { BLOG_TOPICS } from "@/lib/blog-topics";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/our-story`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const topicEntries: MetadataRoute.Sitemap = BLOG_TOPICS.map((topic) => ({
    url: `${SITE_URL}/blog/topics/${topic.slug}`,
    lastModified: SITE_LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const postEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.frontmatter.slug}`,
    lastModified: new Date(post.frontmatter.publishDate),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...topicEntries, ...postEntries];
}
