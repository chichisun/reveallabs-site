# /join copy amendment — 2026-09-02 (awaiting Kase's yes)

Trigger: Dylan Mark (Startups2Students organizer) emailed 09-02: S2S does not allow
unpaid software internships; present the role as founding engineer, think about equity.
The S2S QR code points at reveallabs.co/join?from=s2s, which today says "Unpaid to start"
three times and "intern" once.

## Scope
Four strings on one page. Nothing else.

## Per-screen changes

| # | File:line | Today | Option A (equity in print) | Option B (no equity promise in print) |
|---|---|---|---|---|
| 1 | src/app/join/page.tsx:8 (meta description) | "One founding engineer seat at Reveal. Unpaid to start, on software already live in two restaurants, checking real money every morning." | "One founding engineer seat at Reveal. No salary yet, an ownership stake that vests, on software already live in two restaurants, checking real money every morning." | "One founding engineer seat at Reveal. No salary yet, on software already live in two restaurants, checking real money every morning." |
| 2 | src/components/join/JoinV2.tsx:35 (hero sub) | "Unpaid to start. You'd work on software that is already live in two restaurants, checking real money every morning." | "No salary yet, an ownership stake that vests. You'd work on software that is already live in two restaurants, checking real money every morning." | "No salary yet. You'd work on software that is already live in two restaurants, checking real money every morning." |
| 3 | src/components/join/JoinV2.tsx:79 (pill) | "Unpaid to start" | "Equity, no salary yet" | "No salary yet" |
| 4 | src/components/join/JoinV2.tsx:87-91 (straight paragraph) | "Let me be straight with you: this is unpaid right now, and I won't dress that up. You'd come in as an intern building a real product inside real restaurants. When money starts coming in, you're first in line for the founding engineer job. That's the risk I'm offering." | "Let me be straight with you: there is no salary yet, and I won't dress that up. What there is: an ownership stake that vests over time, on paper before you write a line of code, and a real product inside real restaurants. That's the risk I'm offering." | "Let me be straight with you: there is no salary yet, and I won't dress that up. You'd be building a real product inside real restaurants, and ownership is a conversation we have before you write a line of code. That's the risk I'm offering." |

## Sketch
Same page, same layout, same photos. Only the words in the four spots above change.

## Not changing
Headline "We're hiring one engineer." (founder headline, untouched). The problem block,
the "what you'd do" list, the form, the apply route, the Boulder chip, the email.

## Proof
1. `grep -rniE 'unpaid|\bintern' src/` returns nothing.
2. Rendered page screenshot (desktop + phone width) with the new pill and paragraph.
3. Live URL reveallabs.co/join?from=s2s reads the new copy before 4:40 PM 09-03.

## Order and cost
Edit four strings (5 min) · build locally (2 min) · deploy from this laptop the same way
08-30 went out (`vercel --prod` from reveallabs-site; branch feat/join-page, still unpushed) ·
proof (3 min). ~15 min total.

## Undo
`git revert` of the one commit, redeploy. Or redeploy commit 2794990.

## Decisions only Kase makes
1. Option A or Option B. A puts an equity promise in print, which reverses his 08-25 ruling
   "no equity promises in print." B keeps that ruling and only removes unpaid/intern.
2. Pill wording if he wants different words than the table.
