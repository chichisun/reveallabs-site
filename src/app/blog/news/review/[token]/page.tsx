// src/app/blog/news/review/[token]/page.tsx — magic-link review page.
// Renders the pending item exactly as it would appear on the widget,
// with Approve / Reject buttons that POST through /api/news/decide.
import { createClient } from "@supabase/supabase-js";
import { verifyReviewToken } from "../../../../../lib/news-jwt";

export const dynamic = "force-dynamic";

function adminDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Supabase admin keys not set");
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export default async function ReviewPage(props: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await props.params;
  const payload = await verifyReviewToken(token).catch(() => null);
  if (!payload) {
    return (
      <main
        style={{
          padding: 48,
          fontFamily: "var(--font-sans)",
          maxWidth: 560,
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 500 }}>
          This review link expired
        </h1>
        <p style={{ color: "var(--charcoal-soft)" }}>
          Re-issue a fresh link from the marketing pipeline:{" "}
          <code>pnpm news:resend &lt;item-id&gt;</code>.
        </p>
      </main>
    );
  }

  let item;
  try {
    const { data } = await adminDb()
      .from("news_items")
      .select("*")
      .eq("id", payload.item_id)
      .single();
    item = data;
  } catch (err) {
    console.error("[ReviewPage] failed to load item:", err);
    item = null;
  }

  if (!item) {
    return (
      <main style={{ padding: 48 }}>
        <h1>Item not found</h1>
      </main>
    );
  }
  if (item.status !== "pending") {
    return (
      <main
        style={{
          padding: 48,
          fontFamily: "var(--font-sans)",
          maxWidth: 560,
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 500 }}>
          Already {item.status}
        </h1>
        <p style={{ color: "var(--charcoal-soft)" }}>
          This item was already{" "}
          {item.status === "live" ? "approved" : "rejected"}.
        </p>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: 48,
        fontFamily: "var(--font-sans)",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--green-700)",
          fontWeight: 700,
        }}
      >
        News reveal.ed · review queue
      </p>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 500,
          letterSpacing: "-0.5px",
          lineHeight: 1.2,
          margin: "12px 0 24px",
        }}
      >
        {item.headline_verbatim}
      </h1>

      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        What it means
      </p>
      <p
        style={{
          fontSize: 17,
          lineHeight: 1.55,
          color: "var(--charcoal-soft)",
          marginTop: 8,
          marginBottom: 24,
        }}
      >
        {item.what_it_means}
      </p>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--green-700)",
        }}
      >
        What to do
      </p>
      <p
        style={{
          fontSize: 17,
          lineHeight: 1.55,
          color: "var(--charcoal)",
          marginTop: 8,
          paddingLeft: 16,
          borderLeft: "2px solid var(--green-700)",
          marginBottom: 32,
        }}
      >
        {item.what_to_do}
      </p>

      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--muted)",
          marginBottom: 32,
        }}
      >
        Source:{" "}
        <a
          href={item.source_url}
          target="_blank"
          rel="noreferrer"
          style={{ color: "var(--green-700)" }}
        >
          {item.source_id}
        </a>
      </p>

      <form
        method="GET"
        action="/api/news/decide"
        style={{ display: "flex", gap: 12 }}
      >
        <input type="hidden" name="token" value={token} />
        <button
          name="action"
          value="approve"
          style={{
            flex: 1,
            padding: "12px 24px",
            background: "var(--green-700)",
            color: "var(--cream)",
            border: "none",
            borderRadius: 999,
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Approve
        </button>
        <button
          name="action"
          value="reject"
          style={{
            flex: 1,
            padding: "12px 24px",
            background: "transparent",
            color: "var(--charcoal)",
            border: "1.5px solid var(--charcoal)",
            borderRadius: 999,
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Reject
        </button>
      </form>
    </main>
  );
}
