"use client";

/**
 * Client-side analytics bootstrapper. Mounted once in the root layout.
 *
 * Triggers PostHog initialization on first mount (via dynamic import inside
 * `track`) and fires a `hero_view` for the home page. No-ops if
 * NEXT_PUBLIC_POSTHOG_KEY is unset.
 */

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function AnalyticsBoot() {
  useEffect(() => {
    // Fire a single pageview-equivalent event so the first session at least
    // captures the route. PostHog's auto-pageview also covers this; this is
    // belt-and-suspenders for the first render.
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      track("hero_view").catch(() => {
        // swallow — analytics failure must not break UX
      });
    }
  }, []);

  return null;
}
