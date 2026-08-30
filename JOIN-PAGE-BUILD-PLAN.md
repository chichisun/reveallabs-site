# Build plan — reveallabs.co/join (permanent careers page)

Written 2026-08-30. Awaiting Kase's yes. Nothing in this repo has been touched.
Mockup this is built from: https://claude.ai/code/artifact/2905e338-32ce-4872-812a-5a60cb8d84e7

---

## 1. Scope

One new public page at `reveallabs.co/join`, permanent, not tied to the Sept 3
Boulder event. It carries the open founding-engineer role and an application form
that emails Chayadol. The S2S QR points at `reveallabs.co/join?from=s2s`, which
tags the application so he can tell who came from the pitch.

Not an event page. Someone who finds the site in March lands on the same thing.

## 2. What gets created

| file | what it does |
|---|---|
| `src/app/join/page.tsx` | the route; server component, renders the sections |
| `src/components/join/JoinForm.tsx` | client component: the form, validation, success state |
| `src/styles/join.css` | page styles, scoped under `.joinv2` exactly like `.homev2` |
| `src/app/api/apply/route.ts` | POST: validate → store resume → email Chayadol |

Modified, two lines total:
- `src/components/home-v2/SiteNav.tsx` — one nav link
- `src/components/layout/Footer.tsx` — one footer link

`src/app/layout.tsx` gains one `import "@/styles/join.css";` alongside the three
already there.

## 3. Per-screen changes

Only one screen. Top to bottom, matching the mockup:

1. **Floating glass nav pill** — the same component the homepage uses (`SiteNav`),
   not a new one.
2. **Full-bleed hero** — black-and-white still from `design/video-stills/1a.png`,
   "We're hiring one engineer.", one green Apply button. The image ships as a real
   optimised asset in `public/`, not the base64 blob the mockup uses.
3. **Green rounded block** — what you'd be building, ending on Kase's line: "We're
   building that person, and that's the job you'd be doing."
4. **The role** — Founding engineer, three chips, the straight-talk paragraph,
   three bullets on the actual work.
5. **Who you'd work with** — two colour headshots, Chayadol and Mike.
6. **Apply** — name, email, GitHub/link, resume (optional), why you.
7. **The site's real footer** — the existing `Footer` component, unchanged.

Motion is the site's own: `.reveal-in` at 700ms `cubic-bezier(0.16,1,0.3,1)` with
the 90ms `--i` stagger, plus the hero `rise` cascade. Copied from `home-v2.css`
lines 966-983, already proven in the mockup.

## 4. Sketch

```
  ┌──────────────────────────────────┐
  │ ( reveal.            [ Apply ] ) │  glass pill, fixed
  ├──────────────────────────────────┤
  │                                  │
  │      b&w kitchen photograph      │
  │        ONE ROLE OPEN             │
  │      We're hiring                │
  │      one engineer.               │
  │   Unpaid to start. Already live  │
  │   in two restaurants.            │
  │         [  Apply → ]             │
  ├──────────────────────────────────┤
  │ ╭──────────────────────────────╮ │
  │ │  ( What you'd be building )  │ │  green block
  │ │  A restaurant signs about a  │ │  radius 44px
  │ │  hundred agreements.         │ │
  │ │  Nobody checks them.         │ │
  │ ╰──────────────────────────────╯ │
  │        THE ROLE                  │
  │      Founding engineer           │
  │  [Unpaid] [Denver?] [Start now]  │
  │  ▏Let me be straight with you…   │
  │  – Read a working codebase…      │
  │  WHO YOU'D WORK WITH             │
  │  ( 📷 Chayadol )  ( 📷 Mike )     │
  │ ╭──────────────────────────────╮ │
  │ │  APPLY                       │ │
  │ │  Tell me who you are.        │ │
  │ │  Name / Email / GitHub       │ │
  │ │  Resume [tap to add]         │ │
  │ │  Why you [            ]      │ │
  │ │  [   Send application   ]    │ │
  │ ╰──────────────────────────────╯ │
  │  reveal.   Our Story · Privacy…  │
  └──────────────────────────────────┘
```

## 5. How the form actually works

Client posts `FormData` to `/api/apply`. The route:

1. Rejects if the honeypot field is filled (spam).
2. Requires name, a valid email, and the "why you" text. Everything else optional.
3. If a resume is attached: checks it is PDF/DOC/DOCX and ≤5 MB, then puts it in
   the existing Blob store `reveal-blob-main` (`store_mRLkJxt3LSGRbzoH`, active,
   132 days old, already holding 4 files) and keeps the returned URL.
4. `console.log`s the whole application as JSON first, so a signup can never
   vanish even if email delivery fails — same guard the waitlist route already has.
5. Sends one email via Resend to `chayadol@reveallabs.co`, `replyTo` the applicant,
   subject `Application: <name>`, body carrying the link, the why, the resume URL,
   and the `?from=` tag if present.
6. Returns `{ ok: true }`.

This is the waitlist route's exact shape, with more fields. Nothing invented.

**Deliberately not building:** a database table for applications. The waitlist
doesn't have one either; the inbox is the record. If applications get heavy enough
that the inbox stops being enough, that is the upgrade, and it is a separate job.

## 6. What is NOT changing

- The homepage, /our-story, /blog, /privacy: untouched.
- The existing waitlist form and `/api/waitlist`: untouched. It keeps working.
- No site-wide design tokens change. The slightly darker grey from the mockup
  lives inside `.joinv2` only, so nothing else on the site shifts.
- No environment variables added. `RESEND_API_KEY` and `BLOB_READ_WRITE_TOKEN`
  are both already in production (132 days).
- Nothing in the oxygen repo or the audit app.

**One new dependency:** `@vercel/blob`. Verified not currently installed. It is
the first-party client for the Blob store that is already provisioned; the
alternative is hand-rolling signed uploads, which is more code for the same result.

## 7. The trap to avoid first

This laptop's checkout of `reveallabs-site` is on branch `feat/dashboard-preview`,
**nine commits behind `origin/main`** and three ahead with unrelated work. Building
from here would drag a month of unfinished dashboard-preview work onto the live
site along with the join page.

Step one is branching off a fresh `origin/main`. That is not optional.

## 8. Order and cost

| # | step | time |
|---|---|---|
| 1 | Branch off fresh `origin/main`, confirm clean | 20 min |
| 2 | Page + sections + `join.css`, ported from the mockup | 2 h |
| 3 | `/api/apply`: validation, Blob, Resend | 1 h |
| 4 | Nav + footer link | 15 min |
| 5 | Deploy preview, Kase tests on his phone | 30 min |
| 6 | Promote to production, verify | 15 min |

About half a day, one session.

## 9. Proof I will show

- `curl https://reveallabs.co/join` returns **200** (it returns 404 today —
  measured 2026-08-30).
- A real application submitted from Kase's own phone, arriving in his inbox, with
  the resume link opening.
- `curl https://reveallabs.co` still returns 200 and the waitlist form still
  submits — the regression check.
- The page rendered at 320px and 1600px, light and dark, no sideways scroll.
- With JavaScript disabled, the page still shows all its content.

## 10. Undo

- It is a new route. Deleting `src/app/join/` and `src/app/api/apply/` removes it
  entirely.
- The two link edits are one line each.
- Vercel keeps the current production deployment; instant rollback restores the
  site exactly as it is now.
- Nothing existing is rewritten, so there is nothing to restore.

## 11. Decisions only Kase can make

**a. "Denver or remote"?** My guess is on the page. It is the one claim nobody
ruled. Options: Denver only · Denver or remote · remote fine.

**b. Does the green block carry proof?** He cut the DoorDash example, so the page
currently shows nothing of the product working. Either it ships with no proof, or
he names a real catch he is willing to make public.

**c. The nav label collides.** The site's nav CTA already says **"Join the
waitlist"**. A second link called "Join" next to it is confusing.
Recommendation: keep the URL `/join` (short, says well out loud, good on a QR)
but label the link **"We're hiring"**. Alternative: label it "Careers".

**d. Top nav, footer, or both?** Recommendation: both. The nav is currently
"How it works · Our story · Blog" plus the waitlist CTA, so there is room.

**e. Mike's FUSIAN title** stays off the page until his confirming text arrives.

---

## Status

**PLAN ONLY. Not approved, not started.** No file in this repo has been created,
modified, or committed by this plan.
