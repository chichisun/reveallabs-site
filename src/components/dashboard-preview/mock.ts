/**
 * Anonymized demo data for the dashboard preview.
 * Generic restaurant + generic counterparties — no real vendor/customer names.
 * Numbers echo the case-study scale shown later in Scrollytelling.
 */

export const HOME = {
  greeting: "Hi there",
  place: "Your Restaurant",
  date: "May 20 · Sync now",
  leakTotal: 1240,
  leakCount: 4,
  saved: 1247,
  kpis: [
    { label: "FOOD", value: "28%", state: "good" as const },
    { label: "LABOR", value: "33%", state: "watch" as const },
    { label: "PRIME", value: "61%", state: "good" as const },
  ],
  caveat:
    "Prime is food + labor combined. Yours sits in the healthy 60–65% range; food is running a little high this week.",
  leaks: [
    {
      amount: "−$184",
      name: "Produce Supplier",
      time: "today",
      why: "Case price crept up — $48 vs the $39 you usually pay. 8 hits over 90 days.",
    },
    {
      amount: "−$342",
      name: "Delivery Platform",
      time: "May 15",
      why: "Last week's payout was $4,210. Your orders say it should be $4,552 — 4 didn't pay out.",
    },
  ],
};

export const FLAG = {
  title: "Produce Supplier",
  tags: ["−$184 · price creep", "vendor"],
  lede: "Case price crept up — $48 vs the $39 you usually pay. 8 hits over 90 days.",
  usual: "$39",
  usualMeta: "90-day avg",
  invoice: "$48",
  invoiceMeta: "May 17",
  eq: "+$9 per case × 8 hits in 90 days =",
  eqResult: "−$184 leaking",
  why:
    "They quoted you $39 a case. Since then your invoices have averaged $48, about 23% higher, and the same jump showed up on 8 prior invoices.",
  conf: "Confidence 94% · based on 8 prior hits",
};
