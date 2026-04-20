export const SITE_URL = "https://www.reveallabs.co";

export const SITE_TITLE =
  "reveal. — We find the money your restaurant is leaving on the table";

export const SITE_DESCRIPTION =
  "Revenue intelligence for independent restaurants. We analyze your POS data and deliver 2-3 specific actions that grow revenue in 30 days.";

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
