// src/app/api/news/decide/route.ts — magic-link approve/reject endpoint.
// GET = email-link click (browser navigation); POST = client-side button click.
import { NextRequest, NextResponse } from "next/server";
import { updateTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { verifyReviewToken } from "../../../../lib/news-jwt";

// Service-role client. Bypasses RLS so we can update pending items.
function adminDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Supabase admin keys not set");
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

async function handle(
  action: "approve" | "reject",
  token: string,
  source: "GET" | "POST",
) {
  const payload = await verifyReviewToken(token).catch(() => null);
  if (!payload) {
    return NextResponse.json(
      { ok: false, error: "invalid_or_expired_token" },
      { status: 400 },
    );
  }
  const db = adminDb();
  const { data: item, error: getErr } = await db
    .from("news_items")
    .select("*")
    .eq("id", payload.item_id)
    .single();
  if (getErr || !item) {
    return NextResponse.json(
      { ok: false, error: "not_found" },
      { status: 404 },
    );
  }
  if (item.status !== "pending") {
    return NextResponse.json(
      { ok: false, error: `already_${item.status}` },
      { status: 409 },
    );
  }
  const patch: Record<string, unknown> =
    action === "approve"
      ? { status: "live", published_at: new Date().toISOString() }
      : { status: "rejected" };
  const { error: updErr } = await db
    .from("news_items")
    .update(patch)
    .eq("id", item.id);
  if (updErr) {
    return NextResponse.json(
      { ok: false, error: updErr.message },
      { status: 500 },
    );
  }
  await db.from("news_events").insert({
    item_id: item.id,
    event: action === "approve" ? "approved" : "rejected",
    metadata: { via: source },
  });
  updateTag("news_items");

  if (source === "GET") {
    const baseUrl =
      process.env.NEWS_REVIEW_BASE_URL ?? "https://www.reveallabs.co";
    return NextResponse.redirect(
      new URL(
        `/blog/news/review/done?action=${action}&slug=${item.slug}`,
        baseUrl,
      ),
    );
  }
  return NextResponse.json({ ok: true, action, slug: item.slug });
}

export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const token = u.searchParams.get("token");
  const action = u.searchParams.get("action") as
    | "approve"
    | "reject"
    | null;
  if (!token || !action || !["approve", "reject"].includes(action)) {
    return NextResponse.json(
      { ok: false, error: "missing_params" },
      { status: 400 },
    );
  }
  return handle(action, token, "GET");
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    token?: string;
    action?: "approve" | "reject";
  } | null;
  if (
    !body?.token ||
    !body.action ||
    !["approve", "reject"].includes(body.action)
  ) {
    return NextResponse.json(
      { ok: false, error: "missing_params" },
      { status: 400 },
    );
  }
  return handle(body.action, body.token, "POST");
}
