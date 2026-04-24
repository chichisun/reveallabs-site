"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isStory = pathname === "/our-story";

  return (
    <header
      className={`nav${isHome ? " nav--home" : " nav--solid"}`}
      data-pathname={pathname}
    >
      <div className="container nav-inner">
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
        </nav>
      </div>
    </header>
  );
}
