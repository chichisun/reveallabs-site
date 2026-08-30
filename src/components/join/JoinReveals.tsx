"use client";

import { useEffect } from "react";

/**
 * Scroll-entry reveals for /join — the same mechanism the homepage uses
 * (home-v2.css `.reveal-in`, IntersectionObserver at threshold 0.15, fire once).
 *
 * The `js` class on <html> is what arms the hidden state. If this component
 * never runs, or IntersectionObserver is missing or throws, the class is never
 * added (or gets removed), so every `.reveal-in` block paints normally instead
 * of staying invisible. Hiding content behind an animation that might not
 * arrive is how a careers page ends up blank.
 */
export function JoinReveals() {
  useEffect(() => {
    const root = document.documentElement;
    let io: IntersectionObserver | null = null;

    try {
      if (typeof IntersectionObserver === "undefined") {
        throw new Error("IntersectionObserver unavailable");
      }
      root.classList.add("js-reveals");
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("vis");
              io?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15 },
      );
      document.querySelectorAll(".joinv2 .reveal-in").forEach((el) => io!.observe(el));
    } catch {
      root.classList.remove("js-reveals");
    }

    return () => {
      io?.disconnect();
      root.classList.remove("js-reveals");
    };
  }, []);

  return null;
}
