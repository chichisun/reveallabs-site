/**
 * PostHog analytics wrapper.
 *
 * Lazy-initialized: `getPostHog()` is a no-op when NEXT_PUBLIC_POSTHOG_KEY
 * isn't set, so dev / local works without keys.
 *
 * Privacy posture: per reveallabs.co/privacy ("we do not use trackers,
 * cookies, or analytics on your identity"), PostHog is configured with
 * privacy-friendly defaults: persistence: memory only, no autocapture by
 * default, no person profiles for anonymous visitors. We only capture
 * explicit events (signup, click, etc.) and never identify users beyond
 * email when they submit a form.
 *
 * Update privacy policy copy before enabling — current policy text needs to
 * mention PostHog as an analytics processor.
 */

import type { PostHog } from "posthog-js";

type AnalyticsEvent =
  | "hero_view"
  | "waitlist_modal_opened"
  | "waitlist_submitted"
  | "news_modal_opened"
  | "news_submitted"
  | "news_confirmed"
  | "blog_post_view"
  | "blog_post_completed"
  | "outbound_click";

type AnalyticsProperties = Record<string, string | number | boolean | undefined>;

let cached: PostHog | null = null;
let initialized = false;

async function loadPostHog(): Promise<PostHog | null> {
  if (typeof window === "undefined") return null;
  if (initialized) return cached;
  initialized = true;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  if (!key || key.trim() === "") {
    return null;
  }

  const mod = await import("posthog-js");
  const ph = mod.default;
  ph.init(key, {
    api_host: host,
    persistence: "memory",
    autocapture: false,
    capture_pageview: true,
    capture_pageleave: true,
    disable_session_recording: true,
    person_profiles: "identified_only",
  });
  cached = ph;
  return ph;
}

export async function track(
  event: AnalyticsEvent,
  properties: AnalyticsProperties = {},
): Promise<void> {
  try {
    const ph = await loadPostHog();
    if (!ph) return;
    ph.capture(event, properties);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Analytics track failed:", err);
    }
  }
}

/**
 * Identify a known user (e.g., after waitlist or news subscription).
 * Only the email is sent; no other PII.
 */
export async function identify(email: string, properties: AnalyticsProperties = {}): Promise<void> {
  try {
    const ph = await loadPostHog();
    if (!ph) return;
    ph.identify(email, { ...properties, email });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Analytics identify failed:", err);
    }
  }
}
