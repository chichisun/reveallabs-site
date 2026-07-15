"use client";

import { useEffect, useRef } from "react";

/**
 * Client scope wrapper for the blog article (/blog/[slug]) and topic pages.
 * Provides the shared `.blogv2` style scope (cream/green tokens + Fustat,
 * the floating <SiteNav />, and the dark closer) so the reading view matches
 * the rest of the redesigned site, and runs a gentle fade-up reveal for any
 * `.reveal-in` elements on scroll entry.
 *
 * The article body itself is server-rendered (MDXRemote RSC) and passed in
 * as children — this wrapper only supplies the scope and the entry motion.
 */
export function ArticleShell({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    root
      .querySelectorAll(".blog-card, .reveal-in")
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="blogv2 blogv2--article" ref={rootRef}>
      {children}
    </div>
  );
}
