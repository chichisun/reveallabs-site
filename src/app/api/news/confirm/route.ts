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
import { Resend } from "resend";
import { subscribersDb } from "@/lib/subscribers-db";

export const runtime = "nodejs";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://reveallabs.co";
const NOTIFY_FROM_ADDRESS =
  process.env.RESEND_NEWS_FROM_ADDRESS || "reveal. news <news@reveallabs.co>";
const NOTIFY_TO_ADDRESS =
  process.env.RESEND_NEWS_NOTIFY_TO || "chayadol@reveallabs.co";

async function sendOwnerNotification(args: {
  email: string;
  source: string | null;
  confirmedAt: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  try {
    const resend = new Resend(apiKey);
    const subject = `new reveal. news subscriber: ${args.email}`;
    const text = [
      `New confirmed subscriber to reveal. news.`,
      ``,
      `email:        ${args.email}`,
      `source:       ${args.source ?? "(none)"}`,
      `confirmed at: ${args.confirmedAt}`,
    ].join("\n");
    const { error } = await resend.emails.send({
      from: NOTIFY_FROM_ADDRESS,
      to: [NOTIFY_TO_ADDRESS],
      subject,
      text,
    });
    if (error) console.error("Owner notify Resend error:", error);
  } catch (err) {
    console.error("Owner notify unexpected error:", err);
  }
}

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
        "id, email, source, status, confirmation_token_expires_at",
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

    const confirmedAt = new Date().toISOString();
    const { error: updateErr } = await db
      .from("subscribers")
      .update({
        status: "confirmed",
        confirmed_at: confirmedAt,
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
        at: confirmedAt,
        email: subscriber.email,
      }),
    );

    await sendOwnerNotification({
      email: subscriber.email,
      source: (subscriber as { source?: string | null }).source ?? null,
      confirmedAt,
    });

    return NextResponse.redirect(`${SITE_URL}/blog/news/confirm/done`);
  } catch (err) {
    console.error("Unexpected error in news confirm:", err);
    return NextResponse.redirect(`${SITE_URL}/blog/news/confirm/invalid`);
  }
}
