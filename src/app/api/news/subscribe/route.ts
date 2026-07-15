/**
 * POST /api/news/subscribe — news-feed subscription with double opt-in.
 *
 * Body: { email: string, source?: string }
 *
 * Writes to subscribers table (status='pending'), generates confirmation token
 * (auto via Supabase default), sends Resend confirmation email with magic link.
 *
 * Returns ok=true regardless of email delivery success so the user UX is
 * consistent — failed delivery is logged for ops to retry.
 *
 * Confirmation flow:
 *   /api/news/subscribe -> sends email with link to /api/news/confirm?token=...
 *   /api/news/confirm   -> updates status to 'confirmed' + mirrors to Resend audience
 */

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { subscribersDb } from "@/lib/subscribers-db";

export const runtime = "nodejs";

const TO_FROM_ADDRESS =
  process.env.RESEND_NEWS_FROM_ADDRESS ||
  "reveal. news <news@reveallabs.co>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://reveallabs.co";

type Body = {
  email?: string;
  source?: string;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const source = (body.source || "blog").trim();

  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "That doesn't look like a valid email." },
      { status: 400 },
    );
  }

  // Always log so signups never silently disappear even if downstream fails.
  console.log(
    JSON.stringify({
      event: "news_subscribe_attempt",
      at: new Date().toISOString(),
      email,
      source,
    }),
  );

  let confirmationToken: string;
  let isExisting = false;

  try {
    const db = subscribersDb();

    // Upsert: if email already exists, re-issue the confirmation token so the
    // user can re-confirm. If they were already confirmed, refresh nothing
    // and respond with success (silent — don't leak that they're already on).
    const { data: existing, error: lookupErr } = await db
      .from("subscribers")
      .select("id, email, status, confirmation_token")
      .eq("email", email)
      .maybeSingle();

    if (lookupErr) {
      console.error("subscribers lookup error:", lookupErr);
      return NextResponse.json(
        { error: "Couldn't process signup. Try again?" },
        { status: 500 },
      );
    }

    if (existing && existing.status === "confirmed") {
      // Silent success — don't reveal that they're already on the list.
      return NextResponse.json({ ok: true, delivered: true, alreadyConfirmed: true });
    }

    if (existing) {
      isExisting = true;
      // Re-issue token (refresh expiry, generate new UUID)
      const { data: updated, error: updateErr } = await db
        .from("subscribers")
        .update({
          confirmation_token: crypto.randomUUID(),
          confirmation_token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          source,
        })
        .eq("id", existing.id)
        .select("confirmation_token")
        .single();

      if (updateErr || !updated) {
        console.error("subscribers re-issue error:", updateErr);
        return NextResponse.json(
          { error: "Couldn't process signup. Try again?" },
          { status: 500 },
        );
      }
      confirmationToken = updated.confirmation_token;
    } else {
      const { data: inserted, error: insertErr } = await db
        .from("subscribers")
        .insert({ email, source, status: "pending" })
        .select("confirmation_token")
        .single();

      if (insertErr || !inserted) {
        console.error("subscribers insert error:", insertErr);
        return NextResponse.json(
          { error: "Couldn't process signup. Try again?" },
          { status: 500 },
        );
      }
      confirmationToken = inserted.confirmation_token;
    }
  } catch (err) {
    console.error("Unexpected error in news subscribe:", err);
    return NextResponse.json(
      { error: "Couldn't process signup. Try again?" },
      { status: 500 },
    );
  }

  // Send confirmation email via Resend
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set. Subscribe captured but no confirm email sent.");
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(apiKey);
    const confirmUrl = `${SITE_URL}/api/news/confirm?token=${confirmationToken}`;
    const subject = isExisting
      ? "Confirm your reveal. news subscription"
      : "One click to start getting reveal. news";

    const text = [
      `Thanks for signing up for reveal. news — restaurant industry signal, filtered.`,
      ``,
      `Confirm your subscription:`,
      `${confirmUrl}`,
      ``,
      `(This link expires in 24 hours. If you didn't ask for this, you can ignore the email — no further mail will be sent.)`,
      ``,
      `— reveal. news`,
    ].join("\n");

    const html = `<!doctype html>
<html>
<body style="font-family: -apple-system, system-ui, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; color: #1a1a1a; line-height: 1.55;">
  <p style="margin: 0 0 16px 0; font-size: 16px;">
    Thanks for signing up for <strong>reveal. news</strong> — restaurant industry signal, filtered.
  </p>
  <p style="margin: 0 0 24px 0; font-size: 16px;">
    Confirm your subscription:
  </p>
  <p style="margin: 0 0 24px 0;">
    <a href="${confirmUrl}" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-size: 15px;">
      Confirm subscription
    </a>
  </p>
  <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">
    Or paste this link into your browser:
  </p>
  <p style="margin: 0 0 24px 0; font-size: 13px; color: #999; word-break: break-all;">
    ${confirmUrl}
  </p>
  <p style="margin: 0 0 8px 0; font-size: 13px; color: #999;">
    This link expires in 24 hours. If you didn't ask for this, you can ignore the email — no further mail will be sent.
  </p>
  <p style="margin: 24px 0 0 0; font-size: 13px; color: #999;">— reveal. news</p>
</body>
</html>`;

    const { error } = await resend.emails.send({
      from: TO_FROM_ADDRESS,
      to: [email],
      subject,
      text,
      html,
    });

    if (error) {
      console.error("Resend error for news confirm:", error);
      return NextResponse.json({ ok: true, delivered: false });
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("Unexpected error sending news confirmation email:", err);
    return NextResponse.json({ ok: true, delivered: false });
  }
}
