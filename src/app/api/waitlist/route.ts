import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const TO_ADDRESS = "chayadol@reveallabs.co";
// Resend requires a verified sender domain. Until the site's domain is
// verified there, we use Resend's default "onboarding@resend.dev" fallback
// which works out of the box for new accounts.
const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS || "reveal. waitlist <onboarding@resend.dev>";

type Body = {
  name?: string;
  restaurant?: string;
  email?: string;
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

  const name = (body.name || "").trim();
  const restaurant = (body.restaurant || "").trim();
  const email = (body.email || "").trim();

  if (!name || !restaurant || !email) {
    return NextResponse.json(
      { error: "Name, restaurant, and email are required." },
      { status: 400 },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "That doesn't look like a valid email." },
      { status: 400 },
    );
  }

  // Keep a server-side record in Vercel function logs regardless of whether
  // email actually sends. This means zero signups ever silently disappear.
  console.log(
    JSON.stringify({
      event: "waitlist_signup",
      at: new Date().toISOString(),
      name,
      restaurant,
      email,
    }),
  );

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // No key configured yet — still return success so the user sees the
    // right UX. Signup is captured in the log above.
    console.warn(
      "RESEND_API_KEY not set. Waitlist signup logged but not emailed.",
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(apiKey);
    const subject = `Waitlist: ${name} — ${restaurant}`;
    const text = [
      `Someone just joined the reveal. waitlist.`,
      ``,
      `Name: ${name}`,
      `Restaurant: ${restaurant}`,
      `Email: ${email}`,
      ``,
      `—`,
      `Sent from the reveallabs.co waitlist form.`,
    ].join("\n");

    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [TO_ADDRESS],
      replyTo: email,
      subject,
      text,
    });

    if (error) {
      console.error("Resend error:", error);
      // Still return OK to the user since the signup is logged. They
      // shouldn't feel broken even if email delivery has an upstream issue.
      return NextResponse.json({ ok: true, delivered: false });
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("Unexpected error sending waitlist email:", err);
    return NextResponse.json({ ok: true, delivered: false });
  }
}
