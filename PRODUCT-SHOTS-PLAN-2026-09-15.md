# PRODUCT SHOTS: the website shows the real product (plan, 2026-09-15)

> ## ✅ KASE'S RULINGS, 2026-09-15 09:20, and the APPROVED SCOPE
> **Approved to build now: THE HERO ONLY (step A below).** The four explaining blocks (Banking · Papers · Prices · Receipts) are NOT approved yet: "we need to talk about where that goes, how we're going to show it, first."
> - **D1 (fixture numbers):** "Don't cut it out... manually clean up these pages... a fake food cost, labor cost, income and expenses, sales, all this stuff, in this layout we have, but with fake data." → the mockup keeps its layout; every figure becomes fake-but-believable (profit in single digits, food ≈ 30%, labor ≈ 36%; not the real Lakewood month, not the known-wrong 40%). Done through the generator, never by hand-editing `data.json` (see Codex PS-004).
> - **D2 (live phone shots):** "I don't want this actual data showing." → fake data. The swap runs over the WHOLE rendered DOM (text, attributes, SVG), fails closed on any real string, and the PNGs are read by a human before they ship (Codex PS-002).
> - **D3:** keep Tuk Tuk.
> - **D4:** all five blocks eventually; hero first.
> - **D5:** a third window, now, in `reveallabs-site`.
>
> ### Amendment A2 (Kase, 2026-09-15 ~11:40): drop the caption; the phone shows a bad day
> **Status: PLAN. Waits for Kase's yes.** Ask: "Get rid of this part [the line under the frames], and then on the phone one, make it seem like it's on a bad day currently. It says, 'Oh, your sales are this, which is $500 below this hour'... I want to show that instead of the nightly morning check."
>
> **1. The caption goes.** Delete the `<p class="dash-caption">` and its CSS. The two frames stand alone in the glass. No decision needed.
>
> **2. The phone shows a bad afternoon, in the product's own words.** The live Home already has this sentence family (headline-schedule.ts, founder pick 2026-08-30): in service the hero says `"$180 behind your usual Sunday by 2pm."` and the morning receipt drops to the sub-line. So the phone frame becomes:
> ```
> Good afternoon
> $512 behind your usual Friday by 2pm.
> Checked at 9:00 this morning. What could be checked matched. 4 payment streams. Grubhub hasn't reported since Aug 22. 4 things are waiting on you.
> SALES · TODAY   $553 · 41 orders            ← the in-service card
> ▼ $512 behind your usual Friday                the chip
> ```
> Made by the same shoot: the swap table gets PATTERN rows (regex) for the in-service headline, the tally, the order count and the chip, so it works whatever minute the page is shot and no longer chases a literal live number (the mistake behind this morning's nine runs).
>
> **3. The one-story law forces a choice (D6).** The fixture has no bad day: its Friday Aug 28 at 2:14pm is $1,264.55, $199.55 AHEAD, and the desktop frame beside the phone says exactly that. A bad phone next to a good desktop, same afternoon, is two stories on one page.
> - **(a) Bad day on both frames (my pick).** Today-so-far becomes $553.00 = the fixture's usual-to-here $1,065.00 minus a chosen gap of $512.00. The desktop still's Sales card is re-cut the way the ring was (on the temp copy: "$553.00 · $512.00 behind a usual Friday", the chart's today-line scaled to $553). The phone says the same $512 in the product's sentence. **$512 is the one figure on the page with no fixture row**; the source table names it "the bad-day scene, Kase 09-15" and the checker allows exactly that one row.
> - (b) Bad phone, keep the desktop ahead. Two frames disagree about the same 2pm. Not recommended.
> - (c) A different amount than $512. Any number; same mechanics.
>
> **4. Not changing:** everything below the hero; the ring re-cut; Tuk Tuk, Chayadol, Mildy; the desktop's Revealer; the site's copy elsewhere.
>
> **5. Proof:** `npm run check:shots` green (one allowed no-fixture row); both PNGs read by me; the source table regenerated; the rendered hero at 1440 and 390 in Comet; the manifest's phone text shows the behind sentence and the same $512 as the desktop card.
>
> **6. Cost and the run (D7).** Caption: 5 min. Bad day: ~45 min of script and table work, then ONE shoot. The shoot opens the live app with your session and the classifier blocks me from doing that. Two ways:
> - **(a) You run one line, once** (mint + shoot, as this morning). Built as one-and-done this time: pattern rows, both page states covered, the node dump on any miss.
> - **(b) You add one permission line so I run it myself from now on** and never hand you the line again: a `Bash(...)` allow rule for a shoot wrapper, in `reveallabs-site/.claude/settings.local.json`. I write the exact line for you to paste. If the classifier ignores the rule, we fall back to (a).
>
> **7. Undo:** one site commit to revert; the PNGs regenerate from the previous swap table (v6, kept).
>
> ### Step A, the hero (approved)
> 1. **Fixture re-cut, in the generator.** `oxygen/design-history/desktop-northstar-2026-08/data/` is built by `node data/build.mjs` from `src-*.mjs` + `shared-facts.json`; `data.json` says "Do not hand-edit." Change the inputs (expense and payroll levels in `src-moneyout.mjs`, sales in `src-sales.mjs` as needed) until the derived Home reads believable, then `node data/build.mjs` and `node data/check.mjs` green. One commit on oxygen's design-history, revertable. The rendered Home and Banking are re-read after the rebuild.
> 2. **Shoot script** `oxygen/dashboard/scripts/shoot-site-product.mjs`: serves the oxygen repo ROOT (the skin resolves only from there); shoots `_work/scrap-home-v5.html` at 1440×900 @2x; opens prod `/home` at 390 wide with the local `playwright-storage.json` (gitignored, never committed; if the session is stale the script FAILS CLOSED: it asserts the final URL is `/` or `/home`, that the authenticated marker ("Good morning" + the bottom nav) is present, and that no login form exists; Codex PS-003); applies the swap table to every text node AND attribute AND SVG text; waits for network idle; re-scans the serialized DOM for every real string and aborts on a hit; then shoots. Writes `public/product/ns-home-1440.png`, `public/product/live-home-390.png`, `public/product/SHOT-MANIFEST.json` (oxygen commit, date, swap-table version, assertions passed).
> 3. **Site change:** delete the hand-drawn `.dash-stage` block in `HomeV2.tsx` and its CSS; place two frames (CSS-only desktop and phone bezels) with `next/image` and alt text that names the screen ("Reveal's Home for Tuk Tuk Thai Grill, desktop" / "…on a phone"). The line under it: "Reveal reconciles every dollar in and out of your bank against what you agreed to and signed, and against what it usually costs." Nothing else on the page moves in step A.
> 4. **Proof, runnable:** `npm run build` and `npm run lint` green; `node scripts/check-product-shots.mjs` (new, in this repo) asserts both PNGs exist at the expected dimensions, the manifest names an oxygen commit, alt text is present, and the swap table's real column has zero hits in the shot manifest's saved DOM; the dollar-source table for the TWO hero images only (every figure → fixture row id or swap-table row); the rendered page in Comet at 390 and 1440 with the before/after image; a human read of both PNGs.
> 5. **Known and deferred (Codex PS-001, adjudicated):** the retained sections ("Where it hides", the scrollytelling) still carry $312.40, $89.12, $8,099.50, $8,411.90, $1.82/lb, $1.06/lb, $214.60, $1,297.87, none of which are fixture rows. Step A does NOT rewrite them and does NOT invent mappings. They are reconciled to one dataset when the four blocks are built (step B), which is the conversation Kase asked for. Trigger: step B's plan.
> 6. **Cost:** re-cut 1–2 h · shoot script 1 h · hero swap 1 h · proof 1 h. **Undo:** revert one site commit; delete `public/product/`; revert the fixture commit.
>
> ### Step B, the four blocks (NOT approved; needs the conversation)
> Open questions for Kase: where each block sits on the page relative to "Where it hides" and "How it works"; whether Banking is one annotated ledger cut or the four source cards plus the ledger; whether Papers uses the live rent banner or a mockup lease page; whether the Receipts strip is copy or a shot of `/ops`; and how the retained sections' numbers move onto the fixture (item 5). Everything in §3 below stays the proposal.
>
> ### Codex round 1 (Luna, 6 findings), adjudicated
> PS-001 deferred with a trigger (item 5) · PS-002 accepted (whole-DOM swap, fail closed, human read of PNGs; the session file is gitignored, verified `dashboard/.gitignore:37`) · PS-003 accepted (assert route + authenticated marker, fail closed) · PS-004 accepted (generator, not hand edits) · PS-005 accepted in part: the rendered pages already read "Tuk Tuk Thai Grill · Lakewood" (the shell), Kase ruled keep; the dollar-source table is the required artifact · PS-006 accepted (`check-product-shots.mjs` + named commands; the Comet walk and the owner-critic walk stay manual with a pass/fail line each).


**Status:** PLAN. Nothing built. Waits for Kase's yes to THIS plan.
**Ask (Kase, 2026-09-15):** "update the dashboard image on the website... those are so outdated... 1. our mockup for the desktop 2. just our regular current homepage on the screen... I want to show it on, say, banking. What are the things that we actually look for? ... show our actual dashboard, what we're showing, and how we're checking that... all of it can be mock data... explain the product better so someone looking at the website fully understands what the fuck is going on, just like Kueso."
**Why now (his ruling, over my "not now"):** stale screenshots of the app read as a lie about the product. Warmth (photos, founder essay, film) stays parked; this is correctness.
**Where the work lives:** this repo only (`reveallabs-site`, its own Vercel project) plus one shoot script in `oxygen/dashboard/` that writes images out. The engine seat (oxygen master, phase 3 executing) is not touched.

---

## 0. The test every section must pass

After reading it, a stranger can say in one sentence what Reveal does and how. Kueso's trick is not more words: one section per question the product answers, the actual screen that answers it, one line of copy. Our questions are already ruled (`ROOM-CONTRACT.md`): what needs you today · did the money land · what paper needs you · are prices moving.

## 1. What is on the page today, and what is wrong with it

Measured from `src/components/home-v2/HomeV2.tsx` (1,500 lines, the whole home page) and the live site:

| block | what it shows | problem |
|---|---|---|
| Hero `.dash-stage` | a desktop dashboard and a phone, **drawn by hand in JSX** (~300 lines): nav reads Home · Leaks · Commitments · Pulse; "Leaking now $1,240", "Recovered $1,247", Produce Supplier / Delivery Platform leak rows | that nav has not existed since the flip on 07-23. Hand-drawn means it drifts the day the app changes, which is why it is outdated |
| "Where it hides" | three findings labelled Real (onion +72%, payout $312.40 short, lease $89.12/mo) | fine as a claims block; its numbers do not match the hero's |
| "How it works" scrollytelling | Connect · Audit · Catch with an animated DoorDash payout $8,099.50 vs sales $8,411.90 and the onion invoice | good idea, third set of numbers on one page |
| "It pays for itself" · closer | copy | untouched |

Three different datasets on one page breaks the one-story law (one dataset, one page). The product shots below all come from ONE source: the Lakewood-shaped fixture behind the frozen desktop mockup (`oxygen/design-history/desktop-northstar-2026-08/data/data.json`, August 2026).

## 2. The screens that exist to show (measured 2026-09-15 09:08)

**A. The frozen desktop mockup** (`_work/`, commit `1f33580a`, six ruled rooms). Rendered this morning at 1440px:
- **Home:** owner's logo top left · "Good morning, Chayadol." · the Revealer sentence *"Grubhub's Aug 22 statement says $1,263.27 to you. Nothing has landed in 6 days."* with two check rows and *"10 bank lines · 1 payout · 3 invoices, 34 lines · 2 papers · everything else matched"* · five cards (Income & Expenses ring, Sales $1,264.55, Banking, Vendors, Documents), each with its own clock.
- **Banking:** the money river ($96,821.99 in · $72,580.65 out · $62,556.09 in the bank; DoorDash $14,500.25, Uber Eats $11,131.14, Grubhub Aug 22 $1,263.27 not landed) · four source cards (**Cards · DoorDash · Grubhub · Uber Eats**) · the Revealer rail with CHECKED SO FAR (PNC, Clover, DoorDash, Uber Eats and Grubhub all read · 10 deposits to the penny · $102.09 of Uber Eats' Aug 19 cut has nothing behind it · 24 read from your bank feed, no paper yet · 6 payments went out, nothing to check against) · a deposit ledger where **every row carries a state**.

**B. The live app on prod** (what Mom uses; shot at 390px with Kase's session):
- **Home V4:** *"Checked at 9:00 this morning. What could be checked matched. 25 payment streams. Grubhub hasn't reported since Aug 21. 10 things are waiting on you."* · Sales card · Banking card with DoorDash / Uber Eats / Grubhub / Cards can't check · Documents (66 days, liquor license) · Needs you · 10 (Shamrock shrank the pack $176) · Recent captures.
- **Banking:** $94,296.01 in the bank · the rent-vs-lease banner (*"Rent doesn't match your lease, $2,799.64 more went out, last Jul 3. We haven't proven it's wrong yet."*) · POS VS THEY SAID: Cards can't check · Grubhub ✓ $334.06 · DoorDash ✓ $3,623.71 · Uber Eats ✓ $2,879.18 · money-out ledger with "usual payment · amount not checked" and "✓ invoice".

Both answer the same questions. A is ruled and pretty; B is real and what an operator holds.

## 3. The page after (five product blocks, in owner order)

```
HERO      the desktop mockup Home in a frame (1440 shot) + the live phone Home beside it (390 shot)
          one line under it: "Reveal reconciles every dollar in and out of your bank against what
          you agreed to and signed, and against what it usually costs."
          [replaces the hand-drawn .dash-stage]

BANKING   "Did the money land?"  the deepest block, the wedge.
  ├─ the four source cards from the mockup (Cards · DoorDash · Grubhub · Uber Eats)
  ├─ ONE annotated ledger cut (six rows) with the four row states called out in the margin:
  │     ✓ matched                              all four legs agree
  │     $102.09 unexplained                    statement and deposit agree; 9 charges have no orders behind them
  │     read from your bank feed · no statement yet   one leg missing, said plainly
  │     not landed · 6 days                    their statement says paid; your bank never saw it
  └─ one line: "One deposit, four checks, one word. When a check can't run, it says so."

PAPERS    "What you signed becomes a rule that runs every night."
  ├─ the live Banking rent banner (privacy-swapped) as the shot
  └─ one line: "The lease says rent. The bank says $2,799.64 more went out. Reveal says: not proven wrong yet."

PRICES    "Are prices moving?"  one card row, not a room.
  ├─ the live Home "Needs you" cards (Shamrock shrank the pack for the same price, $176 · raised prices above your usual, $27), swapped to fixture vendors
  └─ one line: "Same item, three invoices, the price crept. You see the case price, not a chart."

RECEIPTS  "It tells you what it couldn't check."  a thin strip, the differentiator.
  ├─ "269 of 269 payouts checked" · "Couldn't check 1 Uber Eats payout: your bank history doesn't reach back far enough yet"
  └─ one line: "Every dollar ends in one of three states: matched, wrong by this much, or can't verify and here's why."
```

Kept as they are: "Where it hides" (three Real findings), "It pays for itself", closer, waitlist, nav. The "How it works" scrollytelling stays but its numbers move onto the fixture so the page has one dataset (DoorDash payout and onion invoice re-pointed to the Grubhub $1,263.27 and the Shamrock chicken thigh $13.50 a case).

Not added, on purpose: Sales (what every POS shows), Income & Expenses (the fixture is wrong there and ie-2/3 are parked), Chat (Kueso's whole product; our side door; a section invites the comparison we lose), the Revealer as its own block (it is the hero sentence already).

## 4. How the shots get made, so they never go stale again

The root cause of "outdated" is that the dashboard was drawn, not shot. Replace the drawing with a shoot:

- `oxygen/dashboard/scripts/shoot-site-product.mjs` (pattern already exists: `_tmp-shoot-scrap-walk.mjs`; this morning's prod shoot ran in 40 s). It:
  1. serves the oxygen repo root on a local port (the mockup's `reveal.css` imports `../../brand/reveal.css`, so the server root must be the repo root, measured this morning: serving `design-history/` alone 404s the skin);
  2. shoots `_work/scrap-home-v5.html` and `_work/scrap-banking-b1-11-tight.html` at 1440×900, device scale 2;
  3. opens prod `/home` and `/banking` at 390 wide with `playwright-storage.json`, runs the **privacy swap** (a table of real string → fixture string applied to text nodes before the shot: vendor names, balances, payroll, card, rent lines; the restaurant name per D3), then shoots;
  4. writes `reveallabs-site/public/product/{ns-home-1440,ns-banking-1440,live-home-390,live-banking-390}.png` and a `SHOT-MANIFEST.json` (commit, date, swap table applied).
- Re-run = re-shoot. When the app changes, the site follows in 40 seconds instead of drifting for two months.

## 5. What is NOT changing

- Nothing in the app, the engine, the mockup's ruled pages, or the milestone. The desktop stays frozen; the shoot only reads it.
- No new photography, founder page, film, or palette (parked, Kase 09-15).
- No new copy sections beyond the five blocks' one-liners; "Where it hides", "It pays for itself" and the closer keep their words.
- No dependency added. Frames are CSS; images are `next/image`.

## 6. Proof I will show before Kase sees it

1. The rendered page in Comet at 390 and 1440 (Kase's `open -a Comet` rule, cache-busted).
2. Old hero vs new hero, side by side, one image.
3. **A table of every dollar figure on the page and the fixture row it comes from** (one-story law). Any figure with no source row fails.
4. `npm run build` green; `npm run brand:guard` equivalent here = the site's lint; a11y pass on the new frames (alt text names the screen, not "dashboard").
5. Privacy check: grep the four PNGs' source pages (the swapped DOM) for every string in the swap table's "real" column; zero hits.
6. The owner-critic walk on the rendered page (memory rule) before the "done" message.

## 7. Order and cost

| step | what | who | time |
|---|---|---|---|
| 0 | Kase answers D1–D5 below | Kase | 5 min |
| 1 | shoot script + privacy swap + manifest | Opus, third window, `reveallabs-site` | ~1 h |
| 2 | fixture re-cut IF D1 = re-cut (three numbers in `data.json`, re-derive, re-shoot) | Opus | 1–2 h, else 0 |
| 3 | hero: delete the hand-drawn `.dash-stage` (~300 lines), place two frames | Opus | ~1 h |
| 4 | Banking · Papers · Prices · Receipts blocks + one-liners; re-point the scrollytelling numbers | Opus | ~3 h |
| 5 | proof §6, Comet walk, humanizer pass on the one-liners | Opus | ~1 h |

≈ one working day of Opus, zero of the engine seat. Codex review of this plan: `claudex-gate review` on this file (Luna, ≤3 rounds) runs before the yes; result reported in chat.

## 8. Undo

One commit on `reveallabs-site`; `git revert` brings the hand-drawn mock back. The PNGs are files under `public/product/`; delete them. The shoot script is one file in oxygen that only writes images out. The fixture re-cut (if chosen) is one commit on `data.json` in oxygen's design-history, revertable.

## 9. The decisions only Kase makes

| # | decision | options | my recommendation |
|---|---|---|---|
| **D1** | Home's known-wrong fixture numbers (40% profit, 5.7% food cost) on a public page. Your own 09-10 ruling: "if the mockup is shown to operators, re-cut first." | (a) re-cut to the targets already in memory (labor 36.09%, delivery $8,932.20, card fees $436.95) · (b) crop the profit ring out of the hero shot | **(a)** re-cut. It is your condition, the targets are written, and a crop leaves a hole in the hero. |
| **D2** | What data the LIVE phone shots carry | (a) privacy swap on the real page (real product, fixture numbers) · (b) seed a demo tenant with the fixture (better, its own plan, days) · (c) real numbers as they are | **(a)** now, (b) later if the site ever becomes a demo tool. (c) puts Mom's vendors, payroll, card and $94,296 balance on a public page; I would not. |
| **D3** | Restaurant name in the shots | keep "Tuk Tuk Thai Grill" (already on the site as the source of the three Real findings) · a fictional name | **keep**. It is the honest one and matches the page. |
| **D4** | Depth | (a) all five blocks · (b) only the hero swap (1 h; fixes "outdated", not "understand what's going on") | **(a)**. The hero swap alone leaves the Banking question, which is the one you asked, unanswered. |
| **D5** | Timing | (a) a third window now, beside the two milestone seats · (b) after phase 3 closes | **(a)** for steps 1–3 (contained, no engine touch); step 4 in the same sitting only if D4 = (a). |

**A yes to this plan = the five blocks, the shoot script, the re-cut, the privacy swap, in that order, in a third window. A yes to the idea is not a yes to the build.**
