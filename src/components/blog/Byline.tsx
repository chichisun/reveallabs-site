/**
 * Byline — attribution primitive for blog content.
 *
 * Three render modes via discriminated union:
 *   - 'essay'       → "By Chayadol Sundarapura · May 4, 2026"  (cornerstone essays, signed)
 *   - 'news'        → "From FDA · May 4"                        (wire items, anonymous curation)
 *   - 'news-byline' → "By Chayadol Sundarapura · May 4"         (future bylined news pieces)
 *
 * Color tokens: matches the site's CSS variable palette used throughout
 * globals.css — `--muted` (#797979 light / #8E8B80 dark) for the base text,
 * `--charcoal` (#2E2E2E light / #ECEBE4 dark) for the bold author/source name.
 * These are the same tokens used by `.blog-featured-byline` / `.blog-card-meta`.
 */

type BylineProps =
  | { kind: 'essay'; author: string; publishDate: string }
  | { kind: 'news'; sourceName: string; capturedAt: string }
  | { kind: 'news-byline'; author: string; capturedAt: string };

export function Byline(props: BylineProps) {
  if (props.kind === 'essay') {
    return (
      <p className="text-sm text-[var(--muted)]">
        By{' '}
        <span className="font-medium text-[var(--charcoal)]">{props.author}</span>
        <span className="mx-2" aria-hidden="true">·</span>
        <time dateTime={props.publishDate}>
          {new Date(props.publishDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </time>
      </p>
    );
  }

  if (props.kind === 'news-byline') {
    return (
      <p className="text-sm text-[var(--muted)]">
        By{' '}
        <span className="font-medium text-[var(--charcoal)]">{props.author}</span>
        <span className="mx-2" aria-hidden="true">·</span>
        <time dateTime={props.capturedAt}>
          {new Date(props.capturedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </time>
      </p>
    );
  }

  // kind === 'news': sourced wire item, anonymous reveal. curation
  return (
    <p className="text-sm text-[var(--muted)]">
      From{' '}
      <span className="font-medium text-[var(--charcoal)]">{props.sourceName}</span>
      <span className="mx-2" aria-hidden="true">·</span>
      <time dateTime={props.capturedAt}>
        {new Date(props.capturedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })}
      </time>
    </p>
  );
}
