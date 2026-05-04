import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';

interface DropLogPeriod {
  id: string;
  period_slug: string;
  period_start: string;
  period_end: string;
  totals_kept: number;
  totals_dropped: number;
  drops_by_category: Record<string, number>;
  drops_by_reason: Record<string, number>;
  computed_at: string;
  published_at: string | null;
}

export const revalidate = 3600; // 1 hour

function publicDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('Supabase env not set');
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

async function fetchPeriod(slug: string): Promise<DropLogPeriod | null> {
  const db = publicDb();
  const { data, error } = await db
    .from('drop_log_periods')
    .select('*')
    .eq('period_slug', slug)
    .not('published_at', 'is', null)
    .maybeSingle();

  if (error) {
    console.error('drop-log page: fetch error', error);
    return null;
  }
  return (data as DropLogPeriod | null) ?? null;
}

export async function generateMetadata(
  { params }: { params: Promise<{ period: string }> }
): Promise<Metadata> {
  const { period } = await params;
  const data = await fetchPeriod(period);
  if (!data) {
    return { title: 'Drop Log — reveal.' };
  }
  return {
    title: `Drop Log — ${prettyPeriod(period)} — reveal.`,
    description: `${data.totals_dropped} of ${data.totals_kept + data.totals_dropped} news items dropped this month. Here's why.`,
  };
}

export default async function DropLogPeriodPage({
  params,
}: {
  params: Promise<{ period: string }>;
}) {
  const { period } = await params;

  // Validate slug format before hitting the db.
  if (!/^\d{4}-\d{2}$/.test(period)) {
    notFound();
  }

  const data = await fetchPeriod(period);
  if (!data) notFound();

  const total = data.totals_kept + data.totals_dropped;
  const dropRate = total > 0 ? Math.round((data.totals_dropped / total) * 100) : 0;

  return (
    <main className="mx-auto max-w-prose px-6 py-16 text-[var(--charcoal)]">
      <p className="text-sm text-[var(--muted)]">Drop Log</p>
      <h1 className="mt-1 text-3xl font-medium">{prettyPeriod(period)}</h1>
      <p className="mt-6 text-lg">
        We dropped <strong>{data.totals_dropped}</strong> of <strong>{total}</strong> news items
        this month ({dropRate}%).
      </p>
      <p className="mt-2 text-[var(--muted)]">
        We don&apos;t name publications. We rate stories against one rule: if an indie owner can&apos;t act on
        it tomorrow, we drop it. This page is the receipt.
      </p>

      {Object.keys(data.drops_by_category).length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-medium">By category</h2>
          <DropTable
            rows={Object.entries(data.drops_by_category).sort((a, b) => b[1] - a[1])}
          />
        </section>
      )}

      {Object.keys(data.drops_by_reason).length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-medium">By rejection reason</h2>
          <DropTable
            rows={Object.entries(data.drops_by_reason).sort((a, b) => b[1] - a[1])}
          />
        </section>
      )}

      <hr className="my-12 border-[var(--charcoal)]/10" />

      <section>
        <h2 className="text-xl font-medium">How this works</h2>
        <p className="mt-4 text-[var(--muted)]">
          Every hour, the news engine pulls items from 18 sources — federal regulators, state and
          local government, and trade publications. Each item gets scored for relevance to indie
          restaurant operators (1–5 unit independents), then graded against an editorial rubric:
          banned filler phrases, fabricated numbers, headline drift, missing this-week action.
          Items that don&apos;t pass get logged here, anonymized to category and reason.
        </p>
        <p className="mt-4 text-[var(--muted)]">
          The drop rule is one sentence: <em>if an indie owner can&apos;t do something different in
          their restaurant tomorrow because they read it, the item gets dropped.</em>
        </p>
      </section>

      <p className="mt-12">
        <a href="/blog/drop-log" className="underline">All months &rarr;</a>
      </p>
    </main>
  );
}

function DropTable({ rows }: { rows: [string, number][] }) {
  return (
    <ul className="mt-4 space-y-0">
      {rows.map(([label, count]) => (
        <li
          key={label}
          className="flex justify-between border-b border-[var(--charcoal)]/10 py-3"
        >
          <span className="text-[var(--charcoal)]">{prettyLabel(label)}</span>
          <span className="font-medium tabular-nums">{count}</span>
        </li>
      ))}
    </ul>
  );
}

function prettyPeriod(slug: string): string {
  const m = slug.match(/^(\d{4})-(\d{2})$/);
  if (!m) return slug;
  const date = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, 1));
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function prettyLabel(s: string): string {
  // Categories are lowercase keywords; reasons are already human-readable.
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
