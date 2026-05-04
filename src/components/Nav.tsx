"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WaitlistTrigger } from "./WaitlistTrigger";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isStory = pathname === "/our-story";
  const isBlog = pathname === "/blog" || pathname.startsWith("/blog/");
  const isDropLog = pathname === "/blog/drop-log" || pathname.startsWith("/blog/drop-log/");

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
            <Link
              href="/blog/drop-log"
              className={`nav-link${isDropLog ? " is-current" : ""}`}
              aria-current={isDropLog ? "page" : undefined}
            >
              Drop Log
            </Link>
          </nav>
        </div>
        {!isHome && (
          <WaitlistTrigger className="btn btn-primary btn-pulse nav-cta">
            Join the waitlist
          </WaitlistTrigger>
        )}
      </div>
      <ThemeToggle />
    </header>
  );
}
