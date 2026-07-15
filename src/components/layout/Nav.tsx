"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WaitlistTrigger } from "@/components/waitlist/WaitlistTrigger";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isStory = pathname === "/our-story";
  const isBlog = pathname === "/blog" || pathname.startsWith("/blog/");

  // The redesigned pages (home-v2, story-v2, blog-v2 index, and now the blog
  // article + topic pages) render their own floating nav (the shared
  // <SiteNav />). Skip the global nav there so they don't show two navs.
  // The blog utility routes (/blog/news*, /blog/subscribe*) keep this one.
  const isNewBlog =
    pathname === "/blog" ||
    (pathname.startsWith("/blog/") &&
      !pathname.startsWith("/blog/news") &&
      !pathname.startsWith("/blog/subscribe"));
  if (isHome || isStory || isNewBlog) return null;

  return (
    <header
      className={`nav${isHome ? " nav--home" : " nav--solid"}`}
      data-pathname={pathname}
    >
      <div className="container nav-inner">
        <div className="nav-left">
          <Link href="/" className="wordmark" aria-label="reveal. home">
            reveal<span className="dot">.</span>
          </Link>
          <nav className="nav-links" aria-label="Primary">
            <Link
              href="/our-story"
              className={`nav-link${isStory ? " is-current" : ""}`}
              aria-current={isStory ? "page" : undefined}
            >
              Our Story
            </Link>
            <Link
              href="/blog"
              className={`nav-link${isBlog ? " is-current" : ""}`}
              aria-current={isBlog ? "page" : undefined}
            >
              Blog
            </Link>
            {/* Mobile: Log in lives inline with the other links (the
                desktop top-right copy below is hidden < 768px). */}
            <a
              href="https://app.reveallabs.co/login"
              className="nav-link nav-login-m"
            >
              Log in
            </a>
          </nav>
        </div>
        {/* Desktop: Log in sits top-right next to the theme toggle, beside
            the waitlist CTA. Hidden on mobile (the inline copy shows there). */}
        <div className="nav-right">
          <a
            href="https://app.reveallabs.co/login"
            className="nav-link nav-login-d"
          >
            Log in
          </a>
          {!isHome && (
            <WaitlistTrigger className="btn btn-primary btn-pulse nav-cta">
              Join the waitlist
            </WaitlistTrigger>
          )}
        </div>
      </div>
      <a
        href="https://app.reveallabs.co/login"
        className="nav-login"
      >
        Log in
      </a>
      <ThemeToggle />
    </header>
  );
}
