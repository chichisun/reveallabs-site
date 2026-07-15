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

  // The home-v2 homepage renders its own floating glass nav (ported from the
  // approved mockup, incl. the brand-intro dock target). Skip the global nav
  // there so the page doesn't show two navs; all other routes keep this one.
  if (isHome) return null;

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
          </nav>
        </div>
        {!isHome && (
          <WaitlistTrigger className="btn btn-primary btn-pulse nav-cta">
            Join the waitlist
          </WaitlistTrigger>
        )}
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
