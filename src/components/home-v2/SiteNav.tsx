"use client";

import { useEffect, useRef } from "react";

/**
 * Shared floating nav from the supy-visual-pass mockups. Extracted from
 * HomeV2 so /our-story and /blog can render the exact same markup.
 *
 * Styling is provided by the page wrapper it sits inside:
 *   - .homev2  (src/styles/home-v2.css)  — glass-over-video variant
 *   - .storyv2 (src/styles/story-v2.css) — solid cream variant
 *   - .blogv2  (src/styles/blog-v2.css)  — solid cream variant
 *
 * Owns the burger toggle and the `scrolled` class (mockup script blocks,
 * ported to a StrictMode-safe effect).
 */
export function SiteNav({
  page = "home",
}: {
  page?: "home" | "story" | "blog";
}) {
  const navRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const b = burgerRef.current;
    const m = menuRef.current;
    if (!nav || !b || !m) return;
    const cleanups: Array<() => void> = [];

    /* burger toggle (mockup nav IIFE) */
    const onBurger = () => {
      const open = m.classList.toggle("open");
      b.setAttribute("aria-expanded", String(open));
    };
    b.addEventListener("click", onBurger);
    cleanups.push(() => b.removeEventListener("click", onBurger));
    const closeMenu = () => {
      m.classList.remove("open");
      b.setAttribute("aria-expanded", "false");
    };
    m.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", closeMenu);
      cleanups.push(() => a.removeEventListener("click", closeMenu));
    });
    /* dismiss like a real menu: Escape, or any tap outside the nav */
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    const onOutside = (e: PointerEvent) => {
      if (m.classList.contains("open") && !nav.contains(e.target as Node)) closeMenu();
    };
    addEventListener("keydown", onKey);
    addEventListener("pointerdown", onOutside);
    cleanups.push(() => removeEventListener("keydown", onKey));
    cleanups.push(() => removeEventListener("pointerdown", onOutside));

    /* shadow / condense once scrolled past the top */
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
    addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => removeEventListener("scroll", onScroll));
    onScroll();

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const home = page === "home";
  const howHref = home ? "#how" : "/#how";
  const ctaHref = home ? "#closer" : "/#closer";

  return (
    <nav aria-label="Main" ref={navRef}>
      <a className="logo" href={home ? "#" : "/"}>
        reveal<em>.</em>
      </a>
      <div className="nav-links">
        <a href={howHref}>How it works</a>
        <a href="/our-story" className={page === "story" ? "active" : undefined}>
          Our story
        </a>
        <a href="/blog" className={page === "blog" ? "active" : undefined}>
          Blog
        </a>
        <a className="btn btn-primary" href={ctaHref}>
          Join the waitlist
        </a>
        <button
          className="nav-burger"
          ref={burgerRef}
          aria-label="Menu"
          aria-expanded="false"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
      <div className="nav-menu" ref={menuRef}>
        <a href={howHref}>How it works</a>
        <a href="/our-story">Our story</a>
        <a href="/blog">Blog</a>
      </div>
    </nav>
  );
}
