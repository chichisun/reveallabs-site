"use client";

/**
 * Subscribe / waitlist CTA — vertical receipt printed by a thermal-style
 * printer. Scroll mechanic:
 *
 *   • The section is 200vh tall. An inner sticky container pins to the
 *     viewport for the first 100vh of scrolling through the section.
 *   • While pinned, scroll progress 0 → 1 maps to the receipt growing
 *     from 0 height up to its full content height. Scrolling back up
 *     retracts the receipt back into the printer.
 *   • Reduced-motion users get the receipt fully revealed, no scroll
 *     coupling.
 *
 * Layout: the printer SVG (charcoal line drawing) sits above the
 * receipt; the receipt grows downward out of the printer's slot. The
 * receipt is centered horizontally on the section's cream background.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { WaitlistTrigger } from "@/components/waitlist/WaitlistTrigger";
import { NewsSubscribeTrigger } from "@/components/news/NewsSubscribeTrigger";

const PAPER_FULL_HEIGHT = 400; // px — fully extended receipt
// Reveal range against `useScroll` progress with offset
// ["start end", "end end"]:
//   progress 0    = section's top hits viewport's bottom (entering view)
//   progress ~0.63 = section's top reaches viewport's top (sticky pins)
//   progress 1    = section's bottom reaches viewport's bottom (sticky releases)
// We start printing once the printer is well into view, and complete
// the reveal exactly at unpin so there's no dead-scroll period at the
// end where the ticket is fully out but more scrolling is needed to
// see its bottom.
const PAPER_REVEAL_START = 0.35;
const PAPER_REVEAL_END = 1.0;

export function BlogSubscribeBlock() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  const paperHeight = useTransform(
    scrollYProgress,
    [PAPER_REVEAL_START, PAPER_REVEAL_END],
    [0, PAPER_FULL_HEIGHT],
    { clamp: true },
  );

  return (
    <section className="ticket-section" ref={sectionRef} aria-label="Subscribe to the blog">
      <div className="ticket-sticky">
        <div className="ticket-printer" aria-hidden="true">
          <PrinterSvg />
        </div>
        <motion.div
          className="ticket-paper"
          style={
            reduce
              ? { height: PAPER_FULL_HEIGHT }
              : { height: paperHeight }
          }
        >
          <div className="ticket-paper-content">
            <p className="blog-subscribe-eyebrow">
              Read by operators
              <span className="blog-subscribe-dot" aria-hidden="true">
                .
              </span>
            </p>
            <h2 className="blog-subscribe-heading">
              The next issue lands in your inbox when something useful
              happens.
            </h2>
            <p className="blog-subscribe-lede">
              One operator&apos;s field notes. Not a newsletter, not a content
              drip — sent only when there&apos;s real signal to share.
            </p>
            <div className="blog-subscribe-actions">
              <NewsSubscribeTrigger className="btn btn-primary blog-subscribe-cta">
                Subscribe
              </NewsSubscribeTrigger>
              <WaitlistTrigger className="blog-subscribe-rss">
                Or join the product waitlist
              </WaitlistTrigger>
              <a
                href="/blog/rss.xml"
                className="blog-subscribe-rss"
                aria-label="Subscribe via RSS"
              >
                <span aria-hidden="true">↗</span> RSS
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Printer SVG                                                         */
/* ------------------------------------------------------------------ */

/** Charcoal line-drawing of a thermal/ticket printer. The viewBox is
 *  trimmed so the cutter slot sits at the SVG's bottom edge — that way
 *  the ticket emerges directly from the slot with no body padding
 *  visible below it. Stroke = currentColor so the parent CSS controls
 *  the color (charcoal in light, cream in dark). */
function PrinterSvg() {
  return (
    <svg
      width="360"
      height="140"
      viewBox="0 0 360 140"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Top cap (suggesting paper-roll cover) */}
      <path d="M50 30 V10 a8 8 0 0 1 8 -8 H302 a8 8 0 0 1 8 8 V30" />

      {/* Vent slits on top */}
      <line x1="80" y1="18" x2="130" y2="18" />
      <line x1="148" y1="18" x2="212" y2="18" />
      <line x1="230" y1="18" x2="280" y2="18" />

      {/* Main body — bottom edge IS the cutter slot at y=140. */}
      <path d="M30 30 H330 a10 10 0 0 1 10 10 V134 a6 6 0 0 1 -6 6 H26 a6 6 0 0 1 -6 -6 V40 a10 10 0 0 1 10 -10 Z" />

      {/* Status LED — small filled dot */}
      <circle cx="50" cy="60" r="3.5" fill="currentColor" />

      {/* Display screen */}
      <rect x="80" y="52" width="100" height="32" rx="3" />
      <line x1="92" y1="64" x2="156" y2="64" strokeOpacity="0.45" />
      <line x1="92" y1="72" x2="140" y2="72" strokeOpacity="0.45" />

      {/* Control buttons */}
      <circle cx="232" cy="68" r="4" />
      <circle cx="252" cy="68" r="4" />
      <circle cx="272" cy="68" r="4" />
      <line x1="296" y1="64" x2="304" y2="64" />
      <line x1="296" y1="72" x2="308" y2="72" />

      {/* Internal cutter mechanism — faint lines just inside the body
          above the slot opening. */}
      <line x1="40" y1="115" x2="320" y2="115" strokeOpacity="0.35" />
      <line x1="60" y1="125" x2="300" y2="125" strokeOpacity="0.55" />

      {/* Slot mouth — bottom edge of the body, drawn slightly heavier
          to read as the cutter where paper emerges. */}
      <line x1="40" y1="140" x2="320" y2="140" strokeWidth="2.5" />
    </svg>
  );
}
