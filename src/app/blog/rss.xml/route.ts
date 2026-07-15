import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site-config";

/**
 * RSS 2.0 feed for the blog at /blog/rss.xml.
 * Includes all published posts, newest first.
 */

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllPosts();
  const buildDate = new Date().toUTCString();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.frontmatter.slug}`;
      const pubDate = new Date(post.frontmatter.publishDate).toUTCString();
      const topicTag = post.topicMeta?.label ?? "";
      return `    <item>
      <title>${escapeXml(post.frontmatter.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.frontmatter.metaDescription)}</description>
      <author>noreply@reveallabs.co (${escapeXml(post.frontmatter.author)})</author>${topicTag ? `\n      <category>${escapeXml(topicTag)}</category>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/rss.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>reveal. — field notes</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Audits, in public. Vendor billing patterns, food cost math, POS migrations — what one operator finds while running the books.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      // Served as application/xml (not application/rss+xml) so browsers apply
      // the linked XSL stylesheet — Chrome routes application/rss+xml to its
      // built-in feed viewer which ignores <?xml-stylesheet?>. Modern RSS
      // readers detect feeds by content, not content-type, so this is safe.
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
