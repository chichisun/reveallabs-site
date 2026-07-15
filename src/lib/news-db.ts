// src/lib/news-db.ts — anon-readable Supabase client for the news widget,
// archive, and permalink pages. Sees only `status='live'` items and the
// public sources list (RLS policies set in marketing/supabase/migrations/0002_news.sql).
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lazy-init so build doesn't crash during static analysis when the env is unset
// (e.g., during prerender of unrelated pages). Pages that import these helpers
// will throw at request time — which is the expected behavior in dev.
function newsDb() {
  if (!url || !anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY not set");
  }
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

export type NewsTier = "auto" | "curated";
export type NewsCategory =
  | "laws"
  | "local"
  | "vendor"
  | "tech"
  | "labor"
  | "recall"
  | "macro";
export type NewsRegion = "national" | "colorado" | "denver";

export interface PublicNewsItem {
  id: string;
  slug: string;
  source_id: string;
  source_name: string | null; // resolved from news_sources join; null if source row missing
  source_url: string;
  headline_verbatim: string;
  headline_friendly: string | null;
  what_it_means: string;
  what_to_do: string;
  category: NewsCategory;
  region: NewsRegion;
  tier: NewsTier;
  published_at: string;
}

export interface PublicNewsSource {
  id: string;
  name: string;
  category: NewsCategory;
  region: NewsRegion;
  tier: NewsTier;
  last_success_at: string | null;
  unhealthy: boolean;
}

// Base columns on news_items; also join news_sources to get the human-readable
// source name for bylines. Supabase PostgREST returns the joined rows as an
// array (even for many-to-one); we flatten via normalizeItem().
const ITEM_COLS =
  "id, slug, source_id, source_url, headline_verbatim, headline_friendly, what_it_means, what_to_do, category, region, tier, published_at, news_sources(name)";

// Supabase infers news_sources as an array; cast through unknown so we can
// handle both the array form (FK join) and null gracefully.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeItem(raw: any): PublicNewsItem {
  const { news_sources, ...rest } = raw as Record<string, unknown> & {
    news_sources: Array<{ name: string }> | { name: string } | null;
  };
  let source_name: string | null = null;
  if (Array.isArray(news_sources)) {
    source_name = news_sources[0]?.name ?? null;
  } else if (news_sources && typeof news_sources === "object") {
    source_name = (news_sources as { name: string }).name ?? null;
  }
  return { ...(rest as Omit<PublicNewsItem, "source_name">), source_name };
}

export async function getTopLiveItems(limit = 3): Promise<PublicNewsItem[]> {
  const { data } = await newsDb()
    .from("news_items")
    .select(ITEM_COLS)
    .eq("status", "live")
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map(normalizeItem);
}

export async function getLiveItemsPaged(opts: {
  offset: number;
  limit: number;
}): Promise<{ items: PublicNewsItem[]; total: number }> {
  const { data, count } = await newsDb()
    .from("news_items")
    .select(ITEM_COLS, { count: "exact" })
    .eq("status", "live")
    .order("published_at", { ascending: false })
    .range(opts.offset, opts.offset + opts.limit - 1);
  return {
    items: (data ?? []).map(normalizeItem),
    total: count ?? 0,
  };
}

export async function getItemBySlug(
  slug: string,
): Promise<PublicNewsItem | null> {
  const { data } = await newsDb()
    .from("news_items")
    .select(ITEM_COLS)
    .eq("slug", slug)
    .eq("status", "live")
    .maybeSingle();
  return data ? normalizeItem(data) : null;
}

export async function getAllSources(): Promise<PublicNewsSource[]> {
  const { data } = await newsDb()
    .from("news_sources")
    .select("id, name, category, region, tier, last_success_at, unhealthy")
    .order("id");
  return (data ?? []) as PublicNewsSource[];
}

export async function getMostRecentLiveAt(): Promise<string | null> {
  const { data } = await newsDb()
    .from("news_items")
    .select("published_at")
    .eq("status", "live")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.published_at ?? null;
}
