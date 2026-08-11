# Claude Design — phone animation + captions

Just the phone and a short caption that changes per screen. No website, no cream section. The phone plays a looping product demo; a caption rides alongside each screen.

## Setup (once)
1. **Skills picker → Interactive prototype.** (Only that one.)
2. **Drag in these 4 screen images** (the real app — so it doesn't redraw from scratch):
   - `docs/dashboard-preview/v3-screens-current/1-home.png`
   - `docs/dashboard-preview/v3-screens-current/2-flag-detail.png`
   - `docs/dashboard-preview/v3-screens/3-capture.png`
   - `docs/dashboard-preview/v3-screens-current/4-commitments.png`
3. Paste the prompt, send.

---

## THE PROMPT (paste this)

> Build an **interactive phone prototype** on a plain light-gray background: a single phone on one side, and a short caption beside it (stack them on mobile). No website, no other sections.
>
> Inside the phone, use the 4 app screens from the images I attached. **Match the images closely** — gray `#F1F2F4` app background, white cards, Inter font, near-black `#14171F` text, hunter-green `#355E3B` and red/amber accents, dark pill buttons, a bottom nav (Home · Commitments · center "+" · Pulse · More). Use only generic names: "Your Restaurant", "Produce Supplier", "Delivery Platform", "Landlord", "Payroll". No real brand names.
>
> The caption beside the phone is a single short line that changes with each screen. Keep it calm and plain: no exclamation points, no em dashes. Show small progress dots (1 of 4 … 4 of 4) under the caption.
>
> Make the phone **auto-play a looping guided demo** — it uses itself, like a screen recording, with no cursor:
> 1. **Home** (leak list). The "$1,240 leaking this week" number counts up from $0; the leak cards ease in one after another. Caption: "Reveal found about $1,240 leaking this week. And exactly where." Hold ~2.5s. A soft tap-ripple lands on the top leak card →
> 2. **Flag detail** slides in (shows "USUAL $39" vs "THIS INVOICE $48" and the math). Caption: "It doesn't just flag it. It shows you the receipt." Hold ~2.5s. Tap-ripple on the center **+** button in the bottom nav →
> 3. **Capture** — a camera viewfinder, a shutter, then extracted bill line items populate row by row. Caption: "Snap a bill. Reveal reads every line for you." Hold ~2.5s. Tap-ripple on the **Commitments** tab →
> 4. **Commitments** (list of recurring bills, rows ease in). Caption: "Every contract, vendor, and renewal, watched so you don't have to." Hold ~2.5s. Then loop back to Home.
>
> Each "tap" shows a soft circular ripple where it lands (no cursor, no finger). Transitions between screens are smooth slides/cross-fades, about 350ms, calm, no bounce. Keep looping.

---

## Reference (no need to paste — the images carry the look)
App tokens: bg `#F1F2F4`, card `#FFFFFF`, ink `#14171F`, secondary `#6B7280`, Inter, hunter green `#355E3B`, leak red `#C23B22` on `#FDF2F0`, amber `#C08532`, dark pill `#14171F`, radii 10–24px.
