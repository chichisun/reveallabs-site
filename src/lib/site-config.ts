export const SITE_URL = "https://www.reveallabs.co";

export const SITE_TITLE =
  "reveal. — A second set of eyes for independent restaurants";

export const SITE_DESCRIPTION =
  "Every contract you signed. Every cost you pay. Every dollar your restaurant makes. Reveal connects it in one place, finds the growth no one else would spot, and hands you the moves to make next month.";

export const SITE_NAME = "reveal.";

// Update when the privacy policy is materially revised
export const POLICY_EFFECTIVE_DATE = "April 2026";

// Used as sitemap `lastModified` — set to the date of the last real content change.
// Don't use `new Date()` (regenerates per request, makes the field meaningless).
export const SITE_LAST_MODIFIED = new Date("2026-04-19");

// Hero intermission video — hosted on Vercel Blob (store: reveal-blob-main).
export const INTERMISSION_VIDEO_URL =
  "https://mrlkjxt3lsgrbzoh.public.blob.vercel-storage.com/intermission.mp4";
export const INTERMISSION_POSTER_URL =
  "https://mrlkjxt3lsgrbzoh.public.blob.vercel-storage.com/intermission-poster.jpg";

// Waitlist CTA mailto — single source of truth.
export const WAITLIST_MAILTO =
  "mailto:chayadol@reveallabs.co?subject=Join%20the%20reveal.%20waitlist";
