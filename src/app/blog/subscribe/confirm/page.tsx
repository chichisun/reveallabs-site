type ConfirmStatus = 'ok' | 'already' | 'expired' | 'invalid';

const messages: Record<ConfirmStatus, { title: string; body: string }> = {
  ok: {
    title: "You're in.",
    body: "The Monday Brief lands every Monday morning. Quiet weeks get a quiet email.",
  },
  already: {
    title: "Already subscribed.",
    body: "Your inbox is already on the list. Nothing more to do.",
  },
  expired: {
    title: "Link expired.",
    body: "These confirmation links expire after 24 hours. Subscribe again from the blog and we'll send a fresh one.",
  },
  invalid: {
    title: "Link not recognized.",
    body: "Either it's been used already, or the URL got mangled in transit. Subscribe again to start over.",
  },
};

function isValidStatus(s: string | undefined): s is ConfirmStatus {
  return s === 'ok' || s === 'already' || s === 'expired' || s === 'invalid';
}

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status = isValidStatus(params.status) ? params.status : 'invalid';
  const { title, body } = messages[status];

  return (
    <main className="mx-auto max-w-prose px-6 py-24">
      <h1 className="text-3xl font-medium text-[var(--charcoal)]">{title}</h1>
      <p className="mt-4 text-[var(--muted)]">{body}</p>
      <p className="mt-8">
        <a href="/blog" className="text-[var(--charcoal)] underline">
          Back to the blog →
        </a>
      </p>
    </main>
  );
}
