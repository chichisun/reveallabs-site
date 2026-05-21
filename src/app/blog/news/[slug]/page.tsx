// src/app/blog/news/[slug]/page.tsx — single-item permalink with JSON-LD,
// tiered byline, related-in-category rail.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { getItemBySlug, getTopLiveItems } from "@/lib/news-db";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@/lib/site-config";

const getCachedItem = (slug: string) =>
  unstable_cache(async () => getItemBySlug(slug), ["news_item", slug], {
    revalidate: 300,
    tags: ["news_items"],
  })();

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  let item;
  try {
    item = await getCachedItem(slug);
  } catch {
    item = null;
  }
  if (!item) return { title: "Not found" };
  const title = item.headline_friendly ?? item.headline_verbatim;
  // First sentence as the meta description — readable and bounded.
  const desc =
    (item.what_it_means.match(/^[^.!?]+[.!?]/) ?? [item.what_it_means])[0]
      .trim()
      .slice(0, 200);
  return {
    title: `${title} — Reveal news`,
    description: desc,
    alternates: { canonical: `${SITE_URL}/blog/news/${slug}` },
    openGraph: {
      title,
      description: desc,
      url: `${SITE_URL}/blog/news/${slug}`,
      type: "article",
    },
  };
}

export default async function NewsItemPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  let item;
  try {
    item = await getCachedItem(slug);
  } catch {
    item = null;
  }
  if (!item) notFound();

  let related: Awaited<ReturnType<typeof getTopLiveItems>> = [];
  try {
    related = (await getTopLiveItems(6))
      .filter((i) => i.category === item.category && i.slug !== slug)
      .slice(0, 3);
  } catch {
    /* keep empty */
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.headline_friendly ?? item.headline_verbatim,
    alternativeHeadline: item.headline_verbatim,
    datePublished: item.published_at,
    description: item.what_it_means,
    url: `${SITE_URL}/blog/news/${item.slug}`,
    author:
      item.tier === "auto"
        ? { "@type": "Organization", name: "Reveal Newsroom" }
        : { "@type": "Person", name: "Chayadol Sundarapura" },
    isBasedOn: item.source_url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="blog-page">
        <div className="blog-page-inner" style={{ maxWidth: 720 }}>
          <Link
            href="/blog/news"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              textDecoration: "none",
            }}
          >
            ← All news
          </Link>
          <p className="blog-eyebrow" style={{ marginTop: 32 }}>
            {item.region} · {item.category}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(28px, 4.5vw, 44px)",
              fontWeight: 500,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              margin: "12px 0 12px",
            }}
          >
            {item.headline_friendly ?? item.headline_verbatim}
          </h1>

          {/* Source's original headline shown as small subtitle for verification.
              Only render if it differs from the friendly headline. */}
          {item.headline_friendly &&
            item.headline_friendly !== item.headline_verbatim && (
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  letterSpacing: "0.04em",
                  color: "var(--muted)",
                  margin: "0 0 24px",
                }}
              >
                Original headline:{" "}
                <span style={{ fontStyle: "italic" }}>
                  &ldquo;{item.headline_verbatim}&rdquo;
                </span>
              </p>
            )}

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Why this matters
          </p>
          <div
            style={{
              fontSize: 18,
              lineHeight: 1.65,
              color: "var(--charcoal-soft)",
              marginTop: 8,
              marginBottom: 28,
            }}
          >
            {item.what_it_means.split(/\n\n+/).map((para, i) => (
              <p key={i} style={{ marginBottom: 16, marginTop: 0 }}>
                {para}
              </p>
            ))}
          </div>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--green-700)",
            }}
          >
            What to do
          </p>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              color: "var(--charcoal)",
              marginTop: 8,
              paddingLeft: 16,
              borderLeft: "2px solid var(--green-700)",
              marginBottom: 32,
            }}
          >
            {item.what_to_do}
          </p>

          <div
            style={{
              borderTop: "1px solid var(--stroke)",
              paddingTop: 24,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--muted)",
            }}
          >
            <p style={{ margin: 0 }}>
              {item.tier === "auto"
                ? "Reveal Newsroom · Auto-published from "
                : "Curated by Chayadol Sundarapura · "}
              <a
                href={item.source_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "var(--green-700)",
                  textDecoration: "none",
                  borderBottom: "1px solid currentColor",
                }}
              >
                {item.source_id} →
              </a>
            </p>
            <p style={{ margin: "4px 0 0" }}>
              Published {new Date(item.published_at).toUTCString()}
            </p>
          </div>

          {related.length > 0 && (
            <section style={{ marginTop: 64 }}>
              <p className="blog-eyebrow">More in {item.category}</p>
              <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
                {related.map((r) => (
                  <li
                    key={r.id}
                    style={{
                      borderTop: "1px solid var(--stroke)",
                      padding: "14px 0",
                    }}
                  >
                    <Link
                      href={`/blog/news/${r.slug}`}
                      style={{
                        color: "var(--charcoal)",
                        textDecoration: "none",
                      }}
                    >
                      <strong>{r.headline_verbatim}</strong>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
