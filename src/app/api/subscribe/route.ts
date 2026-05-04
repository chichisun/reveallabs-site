// src/app/api/subscribe/route.ts — double opt-in email subscription endpoint.
// POST { email, source } → upserts subscriber (status=pending), issues a fresh
// confirmation token, sends a Resend transactional email, logs to email_sends.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { SITE_URL } from "../../../lib/site-config";

export const runtime = "nodejs";

// Service-role client — bypasses RLS so we can insert/update subscribers.
function adminDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey)
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set");
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  let body: { email?: string; source?: string };
  try {
    body = (await req.json()) as { email?: string; source?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const newToken = crypto.randomUUID();
  const tokenExpiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000,
  ).toISOString();

  let db: ReturnType<typeof adminDb>;
  try {
    db = adminDb();
  } catch (err) {
    console.error("subscribe: db init error", err);
    return NextResponse.json(
      { error: "Service unavailable." },
      { status: 503 },
    );
  }

  const { data: subscriber, error: upsertErr } = await db
    .from("subscribers")
    .upsert(
      {
        email,
        status: "pending",
        source: body.source ?? null,
        ip_address: ip === "unknown" ? null : ip,
        confirmation_token: newToken,
        confirmation_token_expires_at: tokenExpiresAt,
      },
      { onConflict: "email", ignoreDuplicates: false },
    )
    .select("id, email, confirmation_token, status")
    .single();

  if (upsertErr || !subscriber) {
    console.error("subscribe: upsert error", upsertErr);
    return NextResponse.json(
      { error: "Could not subscribe. Try again." },
      { status: 500 },
    );
  }

  // Already confirmed — silently succeed. Don't reveal existence to caller.
  if (subscriber.status === "confirmed") {
    return NextResponse.json({ ok: true });
  }

  const confirmUrl = `${SITE_URL}/api/confirm?token=${subscriber.confirmation_token}`;

  const apiKey = process.env.RESEND_API_KEY;
  let sendErr: Error | null = null;

  if (!apiKey) {
    console.warn("subscribe: RESEND_API_KEY not set — confirmation email skipped");
    sendErr = new Error("RESEND_API_KEY not configured");
  } else {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: "reveal. <news@reveallabs.co>",
      to: email,
      subject: "Confirm your subscription to reveal.",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <p style="font-size: 16px; line-height: 1.6;">Tap the link below to confirm your subscription. (Expires in 24 hours.)</p>
          <p style="margin: 24px 0;">
            <a href="${confirmUrl}" style="display: inline-block; padding: 12px 24px; background: #2E2E2E; color: white; text-decoration: none; border-radius: 4px;">
              Confirm subscription
            </a>
          </p>
          <p style="font-size: 14px; color: #797979;">
            Or paste this URL into your browser:<br>
            <a href="${confirmUrl}">${confirmUrl}</a>
          </p>
          <p style="font-size: 14px; color: #797979; margin-top: 32px;">
            If you didn't sign up, ignore this email — nothing happens.
          </p>
          <p style="font-size: 14px; color: #797979;">—Chayadol, reveal.</p>
        </div>
      `,
    });
    if (result.error) {
      sendErr = new Error(result.error.message);
      console.error("subscribe: send error", result.error);
    }
  }

  await db.from("email_sends").insert({
    send_type: "subscribe_confirmation",
    recipient_email: email,
    status: sendErr ? "failed" : "sent",
    error_message: sendErr?.message ?? null,
    sent_at: new Date().toISOString(),
  });

  // Don't 500 on send failure — subscriber row exists, confirm link can be
  // re-sent later. Return ok so the form shows the confirmation message.
  return NextResponse.json({ ok: true });
}
