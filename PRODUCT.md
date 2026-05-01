# PRODUCT.md — reveallabs.co

> Source-of-truth context for the marketing site at reveallabs.co. Compiled
> 2026-05-01 from `../marketing/CLAUDE.md`, `../marketing/prompts/reveal-voice.md`,
> `../marketing/marketing-plan-year-1.md`, the brand kit moodboard, and the
> 2026-05-01 platform-strategy research.

## Register

`brand`

This is a marketing surface — the site IS the product for prospective customers, investors, and partners. Design carries the message; tone is the product. Not a product UI / dashboard / admin tool.

## Product purpose

reveal. is the **Restaurant Audit Brain** that watches every commitment — vendors, leases, delivery platforms, subscriptions, permits, deposits, payouts — and tells independent restaurant operators the moment reality stops matching the deal they signed.

The thesis: most restaurant software assumes clean inputs. Reveal verifies reality *before* the dashboard.

Stage today: pre-launch waitlist. Founder-led. The site converts visitors into waitlist signups; the blog is the long-form credibility surface that ranks for owner-frustration queries and feeds social and outbound channels.

## Users

**Primary — the audience the site is designed to convince:**
- Independent restaurant owners (1–5 unit). Mid-30s to mid-50s. They run a 50–200 seat spot in a US metro. They sign vendor contracts, lease agreements, POS contracts, payment processor terms, delivery platform commission deals, payroll subscriptions, insurance — and never reread them. Most are operating on instinct + Quickbooks + a stack of spreadsheets. They do not have a CFO. They distrust new SaaS by default — they have been burned by lock-in, hidden fees, broken integrations, salespeople.
- Founder mental model: "I caught a $1,800 phantom-surcharge pattern on Sysco invoices last quarter using a spreadsheet I built — operators who don't have time to do this are bleeding money quietly."

**Secondary — who lands here from social/PR/investor channels:**
- Investors / VCs evaluating Reveal as a founder-led restaurant SaaS bet.
- Partners — POS reps, payments processors, accounting/CFO firms, integration partners.
- Future hires — engineers and GTM operators considering Reveal.
- Industry intermediaries — restaurant trade-pub editors, podcast hosts, consultants who scout founders worth covering.
- Multi-unit operators (5+ units) — not the wedge yet, but the upgrade path post-Pillar-6 (a frozen content territory until product readiness clears a defined gate).

**NOT the audience:**
- Diners / restaurant guests. The site is B2B operator-facing. The brand voice is operator-to-operator, not consumer-facing food media.
- Corporate chains and franchise corporate offices. Reveal serves the indie wedge.

## Brand

**Name:** reveal. (lowercase, period included — the period is part of the wordmark).

**Three brand adjectives (from the v2.0 moodboard):** Precise. Warm. Grounded.

**Wordmark:** "reveal." — Space Grotesk, the period rendered in green (var(--green-700)).

**Visual identity:**
- Palette: cream (`#F2F1ED`) ground, charcoal (`#2E2E2E`) text, hunter-green (`#355E3B` / `--green-700`) accent. Dark-mode swap inverts cream and charcoal vars while green stays — see `src/app/globals.css` for the full token set.
- Typography: **Space Grotesk** (sans, body and headings) + **Space Mono** (eyebrows, metadata, monospace UI labels). Both Google Fonts, loaded via `next/font/google`.
- Photography: black-and-white family/restaurant photos (used in /our-story scrollytelling). Editorial, archival, not stylized.
- Illustration: editorial illustrations of operator-world objects (invoices, POS screens, walk-in shelves, contracts, permit folders). NEVER people, NEVER faces. Calm spot illustrations anchored center / lower two-thirds.

**Tone:**
- **Knowledgeable older-brother.** Synthesizes industry chaos for owners who don't have time. Not lecturing. Not founder-thought-leadership.
- **Stratechery-for-restaurants but more accessible.** Insightful, specific, no MBA jargon.
- **Operator-credible.** The founder (Kase Sundarapura) actually runs Tuk Tuk in Denver, CO. Reveal pages can reference this directly when relevant — not gratuitously.
- **Tight.** Every word earns its place. 180–220 word target on long-form social posts; 1500–2500 on blog articles. No throat-clearing, no filler, no preamble.

## Strategic principles for this site

1. **The site is a credibility surface, not a sales funnel.** Visitors are evaluating whether the founder is real and the wedge is real. Polished founder-thought-leadership *fails* this — it reads as marketing. Specificity, restraint, and operator-credible detail succeed.
2. **The blog is the content hub.** Every social post, every Reddit comment, every podcast appearance points back to a blog article that owns the topic on the site. SEO is the highest-ROI channel verified by the strategy research; blog is where it lives.
3. **Light surface, heavy substance.** Cream backgrounds, generous whitespace, restrained typography. The aesthetic is the inverse of the "BREAKING: stop losing thousands!" engagement-bait that floods this audience's feeds. Calm reads as confidence.
4. **No category-reflex visual language.** Restaurant tech defaults: red-and-white food-blog aesthetic, stock kitchen photography, AI-generated shots of plated dishes. Reveal rejects all of it. Cream + charcoal + hunter-green + family-archive photography is the deliberate departure.
5. **The founder is a real operator, not a brand persona.** Names appear (Kase, Tuk Tuk, Denver). Family appears (the /our-story timeline of three generations). The site is designed to feel like an operator's notebook made public, not a corporate marketing site.

## Anti-references

Designs to actively avoid:

- **The Toast / Square / Lightspeed / Touchbistro design language** — bright accent colors, animated dashboard mockups, "businessy" stock photography of smiling staff, gradient hero backgrounds, hero-stat cliché ("$X saved by 1,000 restaurants!"). Generic SaaS template.
- **The food-media aesthetic** — Eater/Bon Appétit-style large food photography, serif headlines, bold red accents. We sit beside food media, not inside it.
- **"AI-startup minimalism"** — pure white background, oversized monospace headlines, gradient blurs, generic "trust by ⓘ ⓘ ⓘ" logo strip, hero metric template. The category-reflex of every YC startup site in 2024–2026.
- **LinkedIn-thought-leadership voice** — "BREAKING: cold email is destroyed!", emoji bullet lists, "comment X for the setup" engagement bait, founder hero shots. The strategy research confirmed this style fails with our audience.
- **Restaurant-influencer aesthetic** — close-up food shots, neon signage, motion graphics. Consumer-facing food culture, not operator-facing operator culture.

## Sample copy (current site)

- Site title: *"reveal. — A second set of eyes for independent restaurants"*
- Site description: *"Every contract you signed. Every cost you pay. Every dollar your restaurant makes. Reveal connects it in one place, finds the growth no one else would spot, and hands you the moves to make next month."*
- /our-story tagline: *"Three generations, one kitchen."*
- Blog tagline (current draft): *"Field notes for independent restaurants."*

The tone is operator-direct, no jargon, no gradient text, no exclamation points. Periods do the work.
