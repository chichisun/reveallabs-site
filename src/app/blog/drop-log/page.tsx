import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';

interface PeriodSummary {
  period_slug: string;
  period_start: string;
  period_end: string;
  totals_kept: number;
  totals_dropped: number;
  published_at: string;
}

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Drop Log — reveal.',
  description: 'Monthly receipt of news items kept and dropped by the reveal. news engine.',
};

function publicDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('Supabase env not set');
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

async function fetchPublishedPeriods(): Promise<PeriodSummary[]> {
  const db = publicDb();
  const { data, error } = await db
    .from('drop_log_periods')
    .select('period_slug, period_start, period_end, totals_kept, totals_dropped, published_at')
    .not('published_at', 'is', null)
    .order('period_end', { ascending: false });

  if (error) {
    console.error('drop-log index: fetch error', error);
    return [];
  }
  return (data ?? []) as PeriodSummary[];
}

export default async function DropLogIndexPage() {
  const periods = await fetchPublishedPeriods();

  return (
    <main className="mx-auto max-w-prose px-6 py-16 text-[var(--charcoal)]">
      <h1 className="text-3xl font-medium">Drop Log</h1>
      <p className="mt-4 text-[var(--muted)]">
        A monthly receipt of news items kept and dropped. We don&apos;t name publications. The drop
        rule: if an indie owner can&apos;t act on it tomorrow, we drop it.
      </p>

      {periods.length === 0 ? (
        <p className="mt-12 text-[var(--muted)]">
          The first monthly Drop Log lands at the end of this month.
        </p>
      ) : (
        <ul className="mt-12 space-y-0">
          {periods.map((p) => {
            const total = p.totals_kept + p.totals_dropped;
            const dropRate = total > 0 ? Math.round((p.totals_dropped / total) * 100) : 0;
            return (
              <li
                key={p.period_slug}
                className="border-b border-[var(--charcoal)]/10 py-4"
              >
                <a
                  href={`/blog/drop-log/${p.period_slug}`}
                  className="flex flex-col gap-1 hover:underline sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <span className="text-lg font-medium">{prettyPeriod(p.period_slug)}</span>
                  <span className="text-sm text-[var(--muted)]">
                    {p.totals_dropped} dropped of {total} ({dropRate}%)
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </main>
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
