/**
 * GET /api/news/confirm?token=<uuid>
 *
 * Double-opt-in confirmation endpoint. User clicks the magic link from their
 * confirmation email; we mark the subscriber as confirmed and redirect to a
 * confirmation page.
 *
 * If the token is invalid or expired, redirect to a clean "expired" page so
 * the user can re-subscribe.
 *
 * Resend audience mirroring is deferred — we maintain the source of truth
 * here and let pipeline/email/audience-manager.ts (Phase 3) sync.
 */

import { NextResponse, type NextRequest } from "next/server";
import { subscribersDb } from "@/lib/subscribers-db";

export const runtime = "nodejs";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://reveallabs.co";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = (searchParams.get("token") || "").trim();

  if (!token) {
    return NextResponse.redirect(`${SITE_URL}/blog/news/confirm/invalid`);
  }

  try {
    const db = subscribersDb();

    // Look up the subscriber by token; ensure not expired.
    const { data: subscriber, error: lookupErr } = await db
      .from("subscribers")
      .select(
        "id, email, status, confirmation_token_expires_at",
      )
      .eq("confirmation_token", token)
      .maybeSingle();

    if (lookupErr) {
      console.error("subscribers confirm lookup error:", lookupErr);
      return NextResponse.redirect(`${SITE_URL}/blog/news/confirm/invalid`);
    }

    if (!subscriber) {
      return NextResponse.redirect(`${SITE_URL}/blog/news/confirm/invalid`);
    }

    if (subscriber.status === "confirmed") {
      return NextResponse.redirect(`${SITE_URL}/blog/news/confirm/done`);
    }

    if (subscriber.status === "unsubscribed") {
      // Re-confirm — flip back to confirmed.
      // Could also redirect to a "rejoin?" interstitial; for now just confirm.
    }

    const expiresAt = new Date(subscriber.confirmation_token_expires_at).getTime();
    if (Date.now() > expiresAt) {
      return NextResponse.redirect(`${SITE_URL}/blog/news/confirm/expired`);
    }

    const { error: updateErr } = await db
      .from("subscribers")
      .update({
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
        unsubscribed_at: null,
      })
      .eq("id", subscriber.id);

    if (updateErr) {
      console.error("subscribers confirm update error:", updateErr);
      return NextResponse.redirect(`${SITE_URL}/blog/news/confirm/invalid`);
    }

    console.log(
      JSON.stringify({
        event: "news_subscribe_confirmed",
        at: new Date().toISOString(),
        email: subscriber.email,
      }),
    );

    return NextResponse.redirect(`${SITE_URL}/blog/news/confirm/done`);
  } catch (err) {
    console.error("Unexpected error in news confirm:", err);
    return NextResponse.redirect(`${SITE_URL}/blog/news/confirm/invalid`);
  }
}
