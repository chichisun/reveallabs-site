/**
 * Blog topic registry — single source of truth for /blog/topics/[topic] pages
 * and for filtering on the /blog index. Topics map to the 8 narrative pillars
 * defined in the marketing-pipeline (CLAUDE.md → "Pillars").
 *
 * Each topic has a `heroImage` — a Higgsfield-generated editorial illustration
 * of operator-world objects that represents the pillar visually. Used as the
 * fallback card image when an article doesn't have its own heroImage yet.
 *
 * Adding a new topic:
 *   1. Generate a pillar image via Higgsfield, save to /public/blog-pillars/<slug>.png
 *   2. Add the entry below.
 *   3. Tag MDX posts with the matching `topic` slug in their frontmatter.
 *   4. The /blog/topics/[topic] route picks it up automatically.
 */

export type BlogTopic = {
  /** URL slug — kebab-case, used in /blog/topics/[slug]. */
  slug: string;
  /** Display name shown in topic chips and topic-page H1. */
  label: string;
  /** Short tagline for SEO + topic-page subhead. */
  tagline: string;
  /** Pillar number from CLAUDE.md (1-8). */
  pillar: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  /** Path to the pillar's hero illustration. Used as card fallback. */
  heroImage: string;
};

export const BLOG_TOPICS: BlogTopic[] = [
  {
    slug: "vendor-billing",
    label: "Vendor Billing & Audits",
    tagline:
      "Sysco surcharges, US Foods invoice errors, supplier credits, and the spreadsheets that catch them.",
    pillar: 2,
    heroImage: "/blog-pillars/vendor-billing.png",
  },
  {
    slug: "food-cost",
    label: "Food Cost & Margin",
    tagline:
      "Inflation, prime cost, COGS, and the math that keeps margins above water.",
    pillar: 2,
    heroImage: "/blog-pillars/food-cost.png",
  },
  {
    slug: "labor",
    label: "Labor & Hiring",
    tagline:
      "Turnover, scheduling, payroll comparisons, and the operator playbooks that actually retain staff.",
    pillar: 3,
    heroImage: "/blog-pillars/labor.png",
  },
  {
    slug: "operations",
    label: "Operations & Audit",
    tagline:
      "POS migrations, daily ops, the audit habit that catches what dashboards miss.",
    pillar: 5,
    heroImage: "/blog-pillars/operations.png",
  },
  {
    slug: "marketing",
    label: "Marketing & Reviews",
    tagline:
      "Yelp, Google, social, and where independent operators actually move the needle.",
    pillar: 4,
    heroImage: "/blog-pillars/marketing.png",
  },
  {
    slug: "industry-trends",
    label: "Industry Trends",
    tagline:
      "Macro signals, regulation shifts, and what they mean for a single-unit indie.",
    pillar: 1,
    heroImage: "/blog-pillars/industry-trends.png",
  },
  {
    slug: "news",
    label: "News & Synthesis",
    tagline: "Weekly synthesis of what crossed the wire and why it matters.",
    pillar: 7,
    heroImage: "/blog-pillars/news.png",
  },
  {
    slug: "local",
    label: "Local & Regional",
    tagline:
      'Below-the-block intelligence: city-level dynamics that don\'t make national press.',
    pillar: 8,
    heroImage: "/blog-pillars/local.png",
  },
];

export function getTopic(slug: string): BlogTopic | null {
  return BLOG_TOPICS.find((t) => t.slug === slug) ?? null;
}

export function topicSlugs(): string[] {
  return BLOG_TOPICS.map((t) => t.slug);
}
