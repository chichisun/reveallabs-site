import { NextResponse } from "next/server";
import { Resend } from "resend";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

const TO_ADDRESS = "chayadol@reveallabs.co";
// Same fallback the waitlist route uses: Resend's default sender works out of
// the box until the site's own domain is verified there.
const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS || "reveal. hiring <onboarding@resend.dev>";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ALLOWED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

// Where an applicant came from. Anything not listed is passed through as a raw
// string so a new QR code doesn't need a deploy, it just reads less prettily.
const KNOWN_SOURCES: Record<string, string> = {
  s2s: "Startups2Students, Boulder",
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const str = (k: string) => (form.get(k) || "").toString().trim();

  // Honeypot. Real people never see this field, so anything in it is a bot.
  // Return ok so the bot believes it worked and doesn't retry.
  if (str("company")) {
    console.log(JSON.stringify({ event: "apply_honeypot", at: new Date().toISOString() }));
    return NextResponse.json({ ok: true, delivered: false });
  }

  const name = str("name");
  const email = str("email");
  const why = str("why");
  const link = str("link");
  const from = str("from");

  if (!name) {
    return NextResponse.json({ error: "Your name, please." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "That doesn't look like an email." },
      { status: 400 },
    );
  }
  if (!why) {
    return NextResponse.json(
      { error: "Tell me something. A couple of sentences is plenty." },
      { status: 400 },
    );
  }

  // Resume is optional. If one is attached it has to be a document we can open
  // and small enough that the inbox stays usable.
  let resumeUrl = "";
  let resumeName = "";
  const resume = form.get("resume");
  if (resume instanceof File && resume.size > 0) {
    if (resume.size > MAX_RESUME_BYTES) {
      return NextResponse.json(
        { error: "That file is over 5 MB. Pick a smaller one." },
        { status: 400 },
      );
    }
    if (resume.type && !ALLOWED_RESUME_TYPES.has(resume.type)) {
      return NextResponse.json(
        { error: "Resumes need to be a PDF or a Word document." },
        { status: 400 },
      );
    }
    resumeName = resume.name;
    try {
      const safeName = resume.name.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 80);
      const blob = await put(`applications/${Date.now()}-${safeName}`, resume, {
        access: "public",
        addRandomSuffix: true,
      });
      resumeUrl = blob.url;
    } catch (err) {
      // A failed upload must not lose the application. Carry on without it and
      // say so in the email, so the reply can just ask for the resume again.
      console.error("Resume upload failed:", err);
      resumeUrl = "";
    }
  }

  const source = from ? KNOWN_SOURCES[from] || from : "";

  // Logged before anything can fail, so no application ever disappears even if
  // email delivery has an upstream problem. Same guard as /api/waitlist.
  console.log(
    JSON.stringify({
      event: "application",
      at: new Date().toISOString(),
      name,
      email,
      link,
      why,
      resumeName,
      resumeUrl,
      source,
    }),
  );

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set. Application logged but not emailed.");
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(apiKey);
    const text = [
      `${name} applied for the founding engineer role.`,
      ``,
      `Email:  ${email}`,
      `Link:   ${link || "(none given)"}`,
      source ? `Came from: ${source}` : `Came from: (direct)`,
      ``,
      `Why them:`,
      why,
      ``,
      resumeName
        ? resumeUrl
          ? `Resume: ${resumeName}\n${resumeUrl}`
          : `Resume: ${resumeName} — upload failed, ask them to resend it.`
        : `Resume: (none attached)`,
      ``,
      `—`,
      `Reply to this email and it goes straight to them.`,
    ].join("\n");

    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [TO_ADDRESS],
      replyTo: email,
      subject: `Application: ${name}`,
      text,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ ok: true, delivered: false });
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("Unexpected error sending application email:", err);
    return NextResponse.json({ ok: true, delivered: false });
  }
}
