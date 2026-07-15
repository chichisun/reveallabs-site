"use client";

import { useEffect, useRef } from "react";

/**
 * Client wrapper for the (server-rendered) blog index. Provides the .blogv2
 * style scope and runs the mockup's interactive bits from
 * design/mockups/supy-visual-pass/blog.html:
 *   - wipe/fade scroll-entry reveals for .blog-card and .reveal-in
 *   - the "reveal.ed" morph (letters settle from spread to snug; the spread
 *     offsets are server-rendered inline so there is no flash)
 * The nav's burger/scrolled logic lives in <SiteNav />.
 */
export function BlogV2Shell({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cleanups: Array<() => void> = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // wipe reveal on scroll entry (same viewport margin as the mockup)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    root.querySelectorAll(".blog-card, .reveal-in").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    // "reveal.ed" morph: letters start spread (SSR inline transform),
    // settle snug after load
    const chars = [...root.querySelectorAll<HTMLElement>(".morph .m-ch")];
    if (reduce) {
      chars.forEach((s) => (s.style.transform = "none"));
    } else {
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          chars.forEach((s) => (s.style.transform = "translateX(0)"));
        });
      });
      cleanups.push(() => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div className="blogv2" ref={rootRef}>
      {children}
    </div>
  );
}
