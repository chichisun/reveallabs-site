// src/app/api/confirm/route.ts — confirms a subscription token.
// GET ?token=<uuid> → flip subscriber to confirmed + mirror to Resend Segment.
// Always redirects to /blog/subscribe/confirm with a status query param.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const runtime = "nodejs";

function adminDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey)
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set");
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

function redirectToStatus(req: NextRequest, status: 'ok' | 'already' | 'expired' | 'invalid') {
  return NextResponse.redirect(
    new URL(`/blog/subscribe/confirm?status=${status}`, req.url)
  );
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return redirectToStatus(req, "invalid");

  let db: ReturnType<typeof adminDb>;
  try {
    db = adminDb();
  } catch (err) {
    console.error("confirm: db init error", err);
    return redirectToStatus(req, "invalid");
  }

  const { data: subscriber, error } = await db
    .from("subscribers")
    .select("id, email, status, confirmation_token_expires_at, resend_contact_id")
    .eq("confirmation_token", token)
    .maybeSingle();

  if (error || !subscriber) return redirectToStatus(req, "invalid");

  if (subscriber.status === "confirmed") return redirectToStatus(req, "already");

  if (new Date(subscriber.confirmation_token_expires_at) < new Date()) {
    return redirectToStatus(req, "expired");
  }

  // Mirror to Resend Segment (formerly "Audience"). Gracefully handle missing config.
  let resendContactId: string | null = subscriber.resend_contact_id;
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (apiKey && audienceId) {
    try {
      const resend = new Resend(apiKey);
      const result = await resend.contacts.create({
        email: subscriber.email,
        audienceId,
        unsubscribed: false,
      });
      if (result.error) {
        console.error("confirm: resend contacts.create error", result.error);
      } else {
        resendContactId = result.data?.id ?? null;
      }
    } catch (err) {
      console.error("confirm: resend exception", err);
      // Don't fail the confirm — Supabase is source of truth. Reconcile via cron later.
    }
  } else {
    console.warn("confirm: RESEND_API_KEY or RESEND_AUDIENCE_ID not set — skipping Resend mirror");
  }

  await db
    .from("subscribers")
    .update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      resend_contact_id: resendContactId,
    })
    .eq("id", subscriber.id);

  return redirectToStatus(req, "ok");
}
