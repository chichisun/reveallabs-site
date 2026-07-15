/**
 * Byline — attribution primitive for blog content cards.
 *
 * Three render modes via discriminated union:
 *   - 'essay'       → "By Chayadol Sundarapura · May 4, 2026"
 *   - 'news'        → "From FDA · May 4"
 *   - 'news-byline' → "By Chayadol Sundarapura · May 4"
 *
 * Uses non-breaking spaces around the bullet so spacing renders even if
 * utility classes get purged in production. Color tokens come from the
 * site's CSS variable palette in globals.css.
 */

const SEPARATOR = " · "; // nbsp · nbsp

type BylineProps =
  | { kind: "essay"; author: string; publishDate: string }
  | { kind: "news"; sourceName: string; capturedAt: string }
  | { kind: "news-byline"; author: string; capturedAt: string };

export function Byline(props: BylineProps) {
  if (props.kind === "essay") {
    return (
      <p className="blog-byline">
        By{" "}
        <span className="blog-byline-name">{props.author}</span>
        <span aria-hidden="true">{SEPARATOR}</span>
        <time dateTime={props.publishDate}>
          {formatDate(props.publishDate, true)}
        </time>
      </p>
    );
  }

  if (props.kind === "news-byline") {
    return (
      <p className="blog-byline">
        By{" "}
        <span className="blog-byline-name">{props.author}</span>
        <span aria-hidden="true">{SEPARATOR}</span>
        <time dateTime={props.capturedAt}>{formatDate(props.capturedAt)}</time>
      </p>
    );
  }

  // kind === 'news': sourced wire item, anonymous reveal. curation
  return (
    <p className="blog-byline">
      From{" "}
      <span className="blog-byline-name">{props.sourceName}</span>
      <span aria-hidden="true">{SEPARATOR}</span>
      <time dateTime={props.capturedAt}>{formatDate(props.capturedAt)}</time>
    </p>
  );
}

function formatDate(iso: string, withYear = false): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
  });
}
