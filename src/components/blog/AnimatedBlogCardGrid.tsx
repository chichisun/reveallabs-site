"use client";

/* AnimatedBlogCardGrid — image mask-wipe entrance for the recent-issues
 * grid. Each card's image is initially clipped from the right edge
 * (invisible), and as the card scrolls into view a horizontal wipe
 * uncovers the image left-to-right. Title, eyebrow, and meta fade up
 * underneath the wipe with a small delay.
 *
 * The wipe reads as editorial — like a curtain pulling back to reveal
 * a magazine spread — rather than the heavier polaroid/grayscale
 * develop. Stagger across each row gives a sense of cards landing in
 * sequence rather than all at once. */

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

type CardPost = {
  frontmatter: {
    slug: string;
    title: string;
    publishDate: string;
  };
  topicMeta: { label: string } | null | undefined;
  readingTimeText: string;
  formattedDate: string;
  cardImage: string;
};

const WIPE_EASE = [0.65, 0, 0.35, 1] as const;

export function AnimatedBlogCardGrid({ posts }: { posts: CardPost[] }) {
  const reduce = useReducedMotion();

  return (
    <ul className="blog-card-grid" aria-label="Earlier issues">
      {posts.map((post, i) => {
        const colDelay = (i % 3) * 0.12;
        return (
          <li key={post.frontmatter.slug}>
            <Link href={`/blog/${post.frontmatter.slug}`} className="blog-card">
              <motion.div
                className="blog-card-image"
                initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
                whileInView={
                  reduce ? undefined : { clipPath: "inset(0 0% 0 0)" }
                }
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{
                  duration: 0.95,
                  delay: colDelay,
                  ease: WIPE_EASE,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.cardImage} alt="" loading="lazy" />
              </motion.div>
              <motion.div
                className="blog-card-text"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{
                  duration: 0.55,
                  delay: colDelay + 0.4,
                  ease: WIPE_EASE,
                }}
              >
                {post.topicMeta && (
                  <p className="blog-card-eyebrow">{post.topicMeta.label}</p>
                )}
                <h3 className="blog-card-title">{post.frontmatter.title}</h3>
                <p className="blog-card-meta">
                  <time dateTime={post.frontmatter.publishDate}>
                    {post.formattedDate}
                  </time>
                  <span className="blog-meta-sep" aria-hidden="true">·</span>
                  {post.readingTimeText}
                </p>
              </motion.div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
