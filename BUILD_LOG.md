# BUILD_LOG — Sequential Overnight Build: pricing → DB → auth (2026-06-13)

Operator: Claude (Opus 4.8). Autonomous. 4 connected tasks, validated + committed + pushed one at a time. Newest entries at the top.

---

## ★ FINAL SUMMARY — all 4 tasks complete (read this first)

| # | Task | Result | Commit |
|---|------|--------|--------|
| 1 | Remove pricing → consultation model | ✅ done | `c9c05da` |
| 2 | `DATABASE_PLAN.md` design doc | ✅ done | `5085d3c` |
| 3 | DB schema (migrations) + auth helpers | ✅ files prepared (not applied to prod) | `fda9201` |
| 4 | Signup/login/pending/admin + auth | ✅ built & smoke-tested | _this commit_ |

Every task: `npm run build` passed with **0 errors** before commit. Nothing was committed on a failing build.

### 🔧 What Maor must do manually before auth works (in order)
1. **Apply the migrations** — Supabase Dashboard → SQL Editor → run, in order:
   `supabase/migrations/0001_phase1_auth_profiles.sql`, then `0002_…`, then `0003_…`. (Idempotent; or `supabase db push`.)
2. **(Optional) phone signup** — Dashboard → Authentication → Providers → enable Phone (needs an SMS provider). **Email signup works without this** — use email until then.
3. **(Optional) env vars** — add `SUPABASE_SERVICE_ROLE_KEY` (same value as your existing service key — code falls back to `SUPABASE_SERVICE_KEY` so nothing breaks if you skip) and `ADMIN_NOTIFICATION_EMAIL=inv4u.business@gmail.com`. `.env.example` documents both. **Do not commit `.env.local`.**
4. **Create your admin account** — sign up at `/signup`, then run the promotion SQL (see Task 4 entry below). I did **not** create it or store a password (the log is in git).
5. **Privacy Policy** — the auth feature collects new PII (account + guest names/phones/emails/passwords). Update the policy **before launching auth** (Israeli Privacy Law + GDPR). I left the policy untouched per the hard rule; this is a launch blocker for the auth feature only — the current public site is unaffected.

### ⚠️ Limitations / known issues
- **Not runtime-tested end-to-end:** migrations aren't applied to the live DB, so I validated via build + page-render + redirect smoke tests, not a real signup→approve→login cycle. Test that once migrations are live.
- **Task 1C (lead form fields) intentionally not changed** — swapping email→event-type/date requires editing `/api/leads` + the `leads` table (forbidden this task). The form still works (name/phone/email). See Task 1 entry. Recommend building the richer form against the new `events` schema next.
- Phone-based password auth depends on the SMS provider (step 2). Email is the reliable path now.
- `lib/supabase/admin.ts` is untyped on purpose (see Task 4) — server-only, results cast.

### ▶️ Recommended next steps
1. Apply migrations + create your admin account; do a real signup→approval test.
2. Update the Privacy Policy for the new data collection.
3. Build the consultation lead form (name + phone + event type + approximate date) against the `events` schema, replacing the email-only form.
4. Build out `/dashboard` (event creation → guest import → WhatsApp invites → RSVP), reusing the `events`/`guests`/`invitations` tables + the `invite_token` RPCs already designed.

---

---

## TASK 4 — Signup / login / pending / admin dashboard ✅ (2026-06-13)

### Pages & routing (all build-validated, smoke-tested)
- **`/signup`** — email **or** phone + password (min 8) + full name → `signUp()` (`approved=false`) → fires `/api/auth/notify-signup` (alerts Maor, best-effort) → redirects to `/pending`.
- **`/login`** — email/phone + password → routes by status: admin → `/admin`, approved → `/dashboard` (or `?next=`), else → `/pending`.
- **`/pending`** — "החשבון שלך ממתין לאישור" + contact info (phone/WhatsApp).
- **`/admin`** — admin-only. Lists all users with **filter (ממתינים / מאושרים / הכל)**, one-click **אישור / ביטול אישור**, and a user-detail modal (name, email, phone, role, signup date). Approve → sets `approved/approved_by/approved_at` and notifies the user (best-effort).
- **`/dashboard`** — placeholder "ברוך הבא, [name] — features coming soon" + sign-out.
- Shared UI: `components/AuthShell.tsx`, `components/AdminUserList.tsx`, `components/SignOutButton.tsx`.

### Auth protection — `proxy.ts` (Next 16's renamed "middleware")
- `/admin/*` → must be `role='admin'`; `/dashboard/*` → must be `approved=true` (else `/pending`); unauthenticated → `/login?next=…`. Verified: both redirect 307 when logged out, and it does **not** 500 even with the DB tables absent (defensive try/catch).
- Note: I renamed `middleware.ts` → `proxy.ts` because Next 16.2 deprecates the `middleware` filename (build emitted a warning). Same behavior.

### Notifications — REUSE of the existing integration (no Twilio/email setup modified)
- `lib/notify.ts`: admin "new signup" alert **reuses** `lib/email`+`lib/twilio` `sendLeadNotification` (already targets Maor). User "approved" message uses the **same Gmail + Twilio credentials** via fresh transports (the existing helpers are hard-wired to Maor's address, so they can't message an arbitrary user). `lib/twilio.ts`/`lib/email.ts` themselves are untouched.
- `/api/auth/notify-signup` is rate-limited (reuses `lib/rateLimit`).

### ⚠️ Maor's admin account — what I could and couldn't do
I **cannot** create a real auth account, because that requires running against the live Supabase (migrations aren't applied, and per CLAUDE.md I don't perform creative/destructive prod DB ops autonomously). So, once you've applied the Task 3 migrations:
1. Go to **`/signup`** and register with **`maorsalem22@gmail.com`** (or `inv4u.business@gmail.com`) + a strong password **you choose**.
2. In Supabase SQL Editor, promote yourself:
   ```sql
   update public.profiles
   set role = 'admin', approved = true, approved_at = now()
   where email = 'maorsalem22@gmail.com';
   ```
3. Log in → you land on `/admin`.
- **Security note:** I deliberately did **NOT** write an admin password into this committed log (it's in git). Per CLAUDE.md secrets handling, set your own password at signup. Flagging this as an intentional deviation from "document the credentials."

### Build fixes during this task
- Hand-written `Database` table types needed `Relationships: []` (supabase-js v2). The service-role admin client still collapsed **writes** to `never`, so `lib/supabase/admin.ts` is intentionally **untyped** (server-only, results cast/validated). Typed reads kept on the browser/server clients.

### Did NOT touch
- `/api/leads`, `lib/twilio.ts`, `lib/email.ts`, `lib/supabase.ts`, `.env.local`, Privacy Policy. No prod DB writes. No password committed.

### Files
- New: `app/signup/page.tsx`, `app/login/page.tsx`, `app/pending/page.tsx`, `app/dashboard/page.tsx`, `app/admin/page.tsx`, `app/admin/actions.ts`, `app/api/auth/notify-signup/route.ts`, `components/AuthShell.tsx`, `components/AdminUserList.tsx`, `components/SignOutButton.tsx`, `lib/notify.ts`, `lib/supabase/middleware.ts`, `proxy.ts`. Edited: `database.types.ts`, `lib/supabase/admin.ts`.

---

## TASK 3 — Implement database schema + auth helpers ✅ (2026-06-13)

### What was built (files, all build-validated)
- **Packages:** installed `@supabase/ssr@0.12.0` (`@supabase/supabase-js` already present).
- **Migrations** in `supabase/migrations/` (idempotent, run in order):
  - `0001_phase1_auth_profiles.sql` — `user_role` enum; `profiles` table (1:1 with `auth.users`, `approved` default false); `is_admin()`/`is_approved()` helpers; `handle_new_user` signup trigger; `touch_updated_at`; `guard_profile_update` (blocks self-escalation of `approved`/`role`); RLS (self-or-admin select/update).
  - `0002_phase2_events_guests_invitations.sql` — `event_type`/`event_status`/`rsvp_status` enums; `events`, `guests`, `invitations` tables + indexes; RLS (owner-must-be-approved CRUD, admin read-all); **public RSVP via `get_guest_by_token()` + `respond_rsvp()` SECURITY DEFINER RPCs** (granted to `anon`+`authenticated`) so the WhatsApp link exposes only one guest row.
  - `0003_phase3_notifications.sql` — `notification_type` enum; `notifications` table; RLS (recipient-or-admin).
- **Types:** `database.types.ts` (hand-authored `Database` type — regenerate from live DB later with `supabase gen types`).
- **Client helpers:** `lib/supabase/client.ts` (browser, anon), `lib/supabase/server.ts` (cookie-bound server client, async `cookies()` for Next 16), `lib/supabase/admin.ts` (service-role, server-only; reads `SUPABASE_SERVICE_ROLE_KEY` with fallback to legacy `SUPABASE_SERVICE_KEY`).
- **Auth helpers:** `lib/auth.ts` — `signUp`/`signIn` (email **or** phone + password, Israeli phone normalised to E.164), `signOut`, `getCurrentUser` (profile), `isApproved`.
- **`.env.example`** updated with `SUPABASE_SERVICE_ROLE_KEY` + `ADMIN_NOTIFICATION_EMAIL` (placeholders only). Kept `SUPABASE_SERVICE_KEY` so the existing `/api/leads` flow is untouched.

### ⚠️ What Maor must do manually (I did NOT run anything against the live database)
Per the brief's fallback (and CLAUDE.md "verify before DB changes"), I prepared the SQL but did **not** apply it to production. To activate:
1. **Apply migrations** — Supabase Dashboard → SQL Editor → run `0001`, then `0002`, then `0003` in order (or `supabase db push` if using the CLI). They're idempotent.
2. **Phone auth (only if you want phone signup):** Dashboard → Authentication → Providers → enable Phone (needs an SMS provider). Email signup works out of the box. Until then, sign up with **email**.
3. **Env var (optional):** the new code reads `SUPABASE_SERVICE_ROLE_KEY` but falls back to your existing `SUPABASE_SERVICE_KEY`, so nothing breaks if you don't add it. Add it when convenient (same value as the service key) and, ideally, `ADMIN_NOTIFICATION_EMAIL=inv4u.business@gmail.com`.
4. **Create your admin account** — covered in Task 4 (sign up via `/signup`, then promote with one SQL statement). Documented there.

### Did NOT touch
- `/api/leads`, `lib/supabase.ts` (its `SUPABASE_SERVICE_KEY` path still works), `.env.local`, Twilio, Privacy Policy. No secrets printed. No prod DB writes.

### Validation
- `npm run build` → **zero errors** (one fix mid-build: typed `profiles` query → used `maybeSingle()` + nullable cast). All new TS files type-check.

### Files
- New: `supabase/migrations/0001…sql`, `0002…sql`, `0003…sql`, `database.types.ts`, `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/admin.ts`, `lib/auth.ts`. Edited: `.env.example`, `package.json`/`package-lock.json`.

---

## TASK 2 — DATABASE_PLAN.md ✅ (2026-06-13)
- Wrote `DATABASE_PLAN.md` at project root. **No tables built** — design only, per the brief.
- Covers: Supabase Auth + the standard **`auth.users` ↔ `public.profiles` 1:1 split** (we don't add columns to `auth.users`); the **`approved` gate enforced in RLS** (not just UI — the DB refuses unapproved users); full schema for `profiles`, `events`, `guests`, `invitations`, `notifications` with enums; **RLS policies per table** incl. **public RSVP via `invite_token` through `SECURITY DEFINER` RPCs** (so the WhatsApp link never exposes the whole table); the signup→approve auth flow; a **3-phase migration plan**; new env vars; a **Privacy Policy update flag** (new PII collection — launch blocker, not changed here); and **8 open questions** for Maor.
- Key calls I made (flagging for review): profiles split from auth.users; approval enforced at the RLS layer; token-based RSVP via RPC rather than a broad public SELECT policy; `honoree_name` added alongside `couple_name_1/2` for non-couple events.
- Validation: `npm run build` → zero errors (docs-only change, code untouched).
- File: `DATABASE_PLAN.md` (new).

---

## TASK 1 — Remove pricing, shift to consultation model ✅ (2026-06-13T17:58Z)

### 1A — Removed all pricing
- **Deleted** `components/SavingsCalculatorSection.tsx` (₪300/meal, "money saved" — off-model) and removed it from the homepage.
- **Deleted** `components/PricingSection.tsx` — it held ₪99/₪299 tiers. It was **dead code** (not imported anywhere), but deleted so no pricing tiers exist in the repo.
- **Deleted** `components/StickyLaunchCTA.tsx` — its "תפסו מקום במחירי השקה" is launch-*pricing* messaging.
- Softened money/savings copy that implied prices: `ComparisonSection` row ("חוסכים אלפי שקלים" → "הזמנת מנות מדויקת לפי אישורים אמיתיים"), `DemoModal` ("אלפי שקלים" → "מנות מיותרות"), `HowItWorks` step detail ("חוסכת אלפי שקלים" → "מונעת הזמנת מנות מיותרות"), `FAQSection` ("מהמשתלמים ביותר בשוק"/"כמה זה עולה?" → consultation framing "איך מתאימים לי חבילה?"), `HeroSection` paragraph ("המשתלם ביותר בשוק" → "ליווי אישי לכל אירוע"), `ContactSection` ("הצעת מחיר" → "שיחת ייעוץ והתאמת חבילה").
- **New** `components/ConsultationSection.tsx` — replaces the calculator slot. Headline "שיחת ייעוץ אישית" + "התאמת חבילה לאירוע שלכם", phone **050-644-5570** shown prominently, three reach-us actions (lead form / WhatsApp / tel:).
- No `/pricing` route existed. Verified **no `₪` symbol** anywhere on the rendered homepage.

### 1B — Consultation CTAs
- Hero primary CTA → **"קבעו שיחת ייעוץ חינם"**; Hero trust-signal "התחלה בחינם — בלי כרטיס אשראי" → "שיחת ייעוץ חינם — בלי התחייבות".
- **Sticky floating button:** consolidated to ONE. Removed the redundant launch-pricing `StickyLaunchCTA` and updated the existing `FloatingWhatsApp` label to **"דברו איתנו עכשיו"** — it already opens WhatsApp to `wa.me/972506445570` (= 050-644-5570). (Decision: two floating WhatsApp buttons would be poor UX; one clear button honors the brief.)
- Mid-page CTA default → **"מוכנים להפוך את האירוע שלכם לחוויה?"** + "קבעו שיחת ייעוץ חינם" → lead form.
- Footer CTA → **"יש לכם שאלה? קבעו שיחה"** / button "קבעו שיחה".
- Header nav CTA "התחילו בחינם" → "קבעו שיחת ייעוץ"; nav link "מחשבון חיסכון" → "ייעוץ" (#consultation). `DemoModal` final CTA → "קבעו שיחת ייעוץ".
- All CTAs route to (a) `#contact` lead form, (b) WhatsApp, or (c) `tel:` — verified.

### 1C — Lead form ⚠️ partial, by design (CONFLICT logged)
- **`/api/leads` verified still working and untouched** (honeypot → 200 with no real lead; missing-email → 400). The CTA flows all point at the same working form.
- **Requested field set (name + phone + event type + event date, dropping email) was NOT applied.** Reason: the hard rule says *do not modify `/api/leads`*, and that endpoint **requires** `email` (validates it, 400 without it) and the `leads` table only has `name/phone/email`. Dropping email would break capture; adding event-type/date would either be silently dropped (no DB columns) or require editing the endpoint + table + lead libs (`lib/email.ts`/`lib/twilio.ts`) — all off-limits this task. Adding fields that don't persist would be misleading, so I left the working 3-field form (name/phone/email) intact.
- **Recommendation:** implement the richer consultation form (name + phone + event type + approximate date) against the **new schema from Tasks 2–4** (which introduces a proper `events` model), in a change where modifying the lead endpoint/table is permitted. Flagging this so it isn't forgotten.

### Note on Privacy Policy (untouched, per hard rule)
- `app/privacy/page.tsx` contains the phrase "להתאמת הצעות מחיר לצרכיך" (a legal purpose statement, not a displayed price). Left **unmodified** per the hard rule. It remains accurate under the consultation model (we do make tailored offers). Flagging for visibility only.

### Validation
- `npm run build` → **zero errors**, 12 routes. Localhost: consultation section + CTA + phone present; no `₪`, no calculator nav, no price claim, no launch-pricing sticky; `/api/leads` honeypot 200 + missing-email 400.

### Files
- Deleted: `SavingsCalculatorSection.tsx`, `PricingSection.tsx`, `StickyLaunchCTA.tsx`.
- New: `ConsultationSection.tsx`.
- Edited: `app/page.tsx`, `Header.tsx`, `Footer.tsx`, `HeroSection.tsx`, `MidPageCTA.tsx`, `ComparisonSection.tsx`, `ContactSection.tsx`, `FAQSection.tsx`, `FloatingWhatsApp.tsx`, `DemoModal.tsx`, `HowItWorks.tsx`.

---

# BUILD_LOG — Autonomous Overnight Build (2026-06-01 → 2026-06-02)

Operator: Claude (Opus 4.8). Founder asleep. Autonomous, no permission prompts.

## Task scope
1. **PRIORITY** — Build 5-step "How it works" scroll-storytelling section (`components/HowItWorks.tsx`), integrate into `app/page.tsx`.
2. Fix Privacy Policy theme on `/privacy` and `/privacy/en` — dark purple → minimalist navy/white. Keep legal text identical.
3. Validate `npm run build` (zero errors), test localhost, commit + push.

## Environment snapshot
- Next 16.2.6, React 18.3.1, Tailwind 3, TypeScript 5
- Existing animation pattern: CSS keyframes (`tailwind.config.ts`) + IntersectionObserver (`components/Reveal.tsx`)
- Brand: navy `#0D1B4B`, blue `#1A56DB`, teal `#00C2A8`; font Rubik; RTL primary

---

## Phase log

### Decisions
- **Animation library:** Used Framer Motion (`framer-motion@^11`, pinned for React 18 safety) as requested. Existing site used CSS keyframes + IntersectionObserver; Framer Motion was added rather than replacing that pattern, so older sections are untouched.
- **Placement:** `HowItWorks` placed immediately after `HeroSection` and before `FeaturesServiceSection`. Rationale: it is the flagship product-narrative explainer; prime top-of-funnel real estate. Flow: hook (Hero) → how it works → features → per-event roadmap details.
- **Palette for the new section:** Restricted to navy `#0D1B4B`, blue `#1A56DB`, teal `#00C2A8`, light gray `#F4F5F7` + white. No purple/magenta gradients (used elsewhere on the site), per task brief — this also visually marks it as the clean flagship section.
- **Layout:** Each step = ~viewport-height block. Desktop alternates illustration/text sides via `md:[direction:ltr]` toggle on the grid (RTL-safe). Mobile stacks illustration above text (`order-1`/`order-2`). Subtle parallax on illustrations via `useScroll`/`useTransform`. All motion gated behind `useReducedMotion()` — reduced-motion users get static, fully-visible content.
- **Illustrations:** 5 hand-authored inline SVGs (no external assets, no video): form+cursor, WhatsApp phone, RSVP phone + live counter (142), AI mic + soundwave, confetti + complete guest list.
- **Privacy theme:** Restyled `/privacy` and `/privacy/en` from dark mesh/purple (`bg-mesh`, `glass-dark`, `text-white/*`, `text-gold`, `text-brand-teal` headings) to minimalist navy/white (`bg-white`, `text-slate-600/700`, `text-brand-navy` headings, `text-brand-blue` accents). **Legal text unchanged** — only class names touched.

### Files changed
- `components/HowItWorks.tsx` (new) — storytelling section + 5 SVG illustrations
- `app/page.tsx` — import + render `<HowItWorks />` after Hero
- `app/privacy/page.tsx` — theme restyle (content identical)
- `app/privacy/en/page.tsx` — theme restyle (content identical)
- `package.json` / `package-lock.json` — added `framer-motion@^11`
- `BUILD_LOG.md` (new), `CLAUDE.md` (committed pre-existing untracked project rules)

### Validation
- `npm run build` → **success, zero errors** (Next 16.2.6, Turbopack). `/privacy` and `/privacy/en` still prerender as static.
- `next start` smoke test: home, `/privacy`, `/privacy/en` all HTTP 200. Home contains all 5 step headlines + `how-it-works` anchor. Both privacy pages serve `bg-white` (no `bg-mesh`).

### To verify on inv4u.vercel.app in the morning
1. Scroll the home page — the "איך זה עובד" section sits right after the hero; 5 steps fade/slide in, illustrations alternate sides on desktop, stack on mobile.
2. Check at 375px / 768px / 1440px — illustration-above-text on mobile, side-by-side on desktop.
3. Open `/privacy` and `/privacy/en` — should be white/navy, readable, no dark purple. Legal text intact.
4. Toggle OS "reduce motion" — section should appear static, no parallax/animation, all content visible.
5. Browser console should be clean (build + SSR were error-free; verify no client hydration warnings).

### Known issues / notes
- Could not run a real browser to inspect the JS console for client-side hydration warnings (no headless browser in this environment). Build + SSR + HTTP checks all clean; risk is low. Verify console manually in the morning.
- `next` remains pinned to `latest` (CLAUDE.md priority #4) — out of scope for tonight, left untouched.
- 2 moderate npm audit advisories existed before and after install (transitive); not introduced by this change, not addressed (out of scope, no secret/key work per safety rules).

### Did NOT touch (per hard safety rules)
- `.env.local`, `.env.example`, `.gitignore`, any secret/key, Twilio/Supabase/email integration, `/api/leads`. No force push.

### Commit
- `b0cffda` — pushed to `origin/main` at f83f984..b0cffda. Vercel auto-deploy triggered.

---

# BUILD_LOG — Security Hardening Session (2026-06-13)

Operator: Claude (Opus 4.8). Autonomous, no permission prompts. Founder doing Meta verification in parallel.

## Environment snapshot
- Next 16.2.6 (Turbopack), React 18, Tailwind 3, TypeScript 5
- All work validated with `npm run build` (zero errors) + localhost smoke tests before commit.

## TASK 1 — Lead form spam protection ✅ (2026-06-13T12:36Z)
**Decisions**
- **Rate limiter:** Upstash Redis is NOT installed (not in deps), so used the requested in-memory fallback. New `lib/rateLimit.ts` — fixed-window counter, max **5 submissions per IP per hour** on `/api/leads`. Returns HTTP 429 + `Retry-After` header. Caveat logged: on Vercel each serverless instance has its own memory, so the effective limit is `5 × warm instances`; structured for an easy Upstash swap if spam becomes real. Has opportunistic Map cleanup to avoid unbounded growth.
- **Client IP:** extracted from `x-forwarded-for` (left-most) → `x-real-ip` → `'unknown'` (Vercel proxy aware).
- **Honeypot:** added hidden `company` field to `ContactSection` form (off-screen, `aria-hidden`, `tabIndex=-1`, `autoComplete=off` — not `display:none` so naive bots still fill it). Server: if `company` is non-empty, returns **200 OK without saving or notifying** (so bots don't learn they were caught).
- **Validation** (new `lib/validation.ts`, server-authoritative): email regex (`^[^\s@]+@[^\s@]+\.[^\s@]{2,}$`, ≤254 chars); Israeli phone (local `0[2-9]XXXXXXXX` or intl `+972[2-9]XXXXXXXX`, strips spaces/dashes/parens); name length 2–100 chars. All error messages in Hebrew.
- Order of checks: rate limit → honeypot → required fields → name → email → phone → save. Malformed/abusive attempts count toward the rate limit (intentional).

**Files:** `lib/rateLimit.ts` (new), `lib/validation.ts` (new), `app/api/leads/route.ts` (rewired), `components/ContactSection.tsx` (honeypot field + state).

**Validation:** honeypot → 200 (not saved); bad phone/email/short-name → 400 with correct Hebrew messages; 6th request from one IP → 429. All confirmed via curl against `next start`.

## TASK 2 — Security headers ✅
- Added via `next.config.js` `headers()` on `/:path*`: **CSP** (permissive — `unsafe-inline`/`unsafe-eval` for Next runtime, allows Google Fonts + `*.supabase.co` connect; `frame-ancestors 'none'`, `object-src 'none'`, `form-action 'self'`, `base-uri 'self'`), **X-Frame-Options: DENY**, **X-Content-Type-Options: nosniff**, **Referrer-Policy: strict-origin-when-cross-origin**, **Permissions-Policy: geolocation=(), camera=(), microphone=()**.
- Verified: all 5 headers present on `/`; home, `/privacy` still 200. CSP intentionally permissive to start; tighten with nonces later.

## TASK 3 — Pin Next.js version ✅
- `package.json`: `"next": "latest"` → `"next": "16.2.6"` (the installed version). Ran `npm install`; `package-lock.json` root dependency now pins `next: 16.2.6`.

## TASK 4 — Environment variable safety check ✅
- `.env.local` is git-ignored (`git check-ignore` confirms) and NOT in the staged set. **Not touched.**
- `.env.example` contains placeholders only (empty values) — no real secrets.
- Searched codebase for secret patterns (`sk-`, `AC…`, `AIza…`, `eyJ…`, `SG.`, `AKIA`, `ghp_`, `-----BEGIN`, `whsec_`) — **no matches** in source. `lib/supabase.ts`, `lib/twilio.ts`, `lib/email.ts` all read from `process.env`. No hardcoded keys.

## TASK 5 — Cookie consent banner ✅
- New `components/CookieConsent.tsx` ('use client'), rendered in `app/layout.tsx`. Minimalist navy (`#0D1B4B`) / blue (`#1A56DB`) / white, RTL. Hebrew primary + English fallback line. Two actions: **אישור** (accept) / **דחיית לא-חיוניות** (reject non-essential). Choice saved in `localStorage` (`inv4u_cookie_consent`); banner hidden once a valid choice exists; gracefully shows if localStorage is blocked. No flash for returning users (reveal gated behind client mount).

## Did NOT touch (per hard safety rules)
- `.env.local`, no secret rotation (Supabase/Gmail/Twilio left for founder), no force push, Twilio integration untouched, Privacy Policy untouched.

## Build & validation
- `npm run build` → **success, zero errors** (one fixed mid-build: Map iteration needed `forEach` instead of `for…of` for the tsconfig target — no global config change).
- `next start` smoke tests: headers, validation, honeypot, rate-limit 429 all confirmed.

## Commit
- `8316d5b` — "Security hardening: rate limit, headers, version pin, cookie consent" — pushed to `origin/main` at 741d01b..8316d5b. Vercel auto-deploy triggered.

## To verify on inv4u.vercel.app in the morning
1. Submit the contact form normally — should still save a lead + send WhatsApp/email (real path untouched).
2. Cookie banner appears at bottom on first visit; choosing accept/reject dismisses it and it stays dismissed on reload.
3. Browser DevTools → Network → check response headers on the document for CSP + the 4 other security headers; check the console for any CSP violations (CSP is permissive, none expected — if a third-party script is blocked, add its origin to the relevant `*-src`).
4. Try submitting the form with an invalid Israeli phone or bad email — should be rejected with a Hebrew error.

---

# BUILD_LOG — 4-Part Site Update (2026-06-13)

Operator: Claude (Opus 4.8). Autonomous, no permission prompts. Founder doing Meta verification in parallel.
Environment: Next 16.2.6 (Turbopack), React 18, Tailwind 3, TS 5. Build validated (zero errors) + localhost smoke tests before commit.

## PART 1 — Dedicated /how-it-works page ✅ (2026-06-13T17:24Z)
**Decisions**
- New route `app/how-it-works/page.tsx` (server component, static-prerendered, RTL) with its own `metadata` (title/description for SEO). Layout: Header → page hero (navy `bg-mesh`) → expanded 5-step story → process FAQ → closing CTA → Footer → FloatingWhatsApp.
- `HowItWorks` component made reusable via a new `expanded?: boolean` prop. In expanded mode each step shows a longer `longDescription` + a 3-bullet `details` checklist, and the component **hides its own internal heading** (the page hero supplies it). Default (non-expanded) behavior is unchanged — but the homepage no longer renders it.
- New `components/ProcessFAQ.tsx` — 6 process-specific Q&As (setup time, "I'm not technical", non-WhatsApp guests, editing after send, guests changing their answer, how it saves money), reusing the existing FAQ accordion pattern.
- **Homepage:** removed the full `<HowItWorks />`; replaced with new `components/HowItWorksCTA.tsx` — an elegant single-CTA teaser (step pills + button "איך זה עובד? לחצו לראות את התהליך המלא" → `/how-it-works`). Not pushy.
- Added "איך זה עובד" as the first link in the header nav so the page is discoverable.

**Files:** `app/how-it-works/page.tsx` (new), `components/ProcessFAQ.tsx` (new), `components/HowItWorksCTA.tsx` (new), `components/HowItWorks.tsx` (expanded prop + richer copy), `app/page.tsx` (swap), `components/Header.tsx` (nav link).

## PART 2 — Premium invitation mockup ✅
**Decisions**
- **Unsplash photo:** `https://images.unsplash.com/photo-1519741497674-611481863552` — a happy wedding couple. Verified the permanent CDN URL returns `200 image/jpeg`, and confirmed via web search it is an Unsplash wedding image. **Could NOT definitively confirm the photographer's name** through available tools, so per CLAUDE.md ("never invent") I did **not** fabricate one — attributed to "Unsplash" with the source URL in a code comment + an `sr-only` credit. Unsplash license permits free commercial use; visible attribution is appreciated, not required.
- Served via **`next/image`** (`fill`, `sizes="300px"`, `loading="lazy"`, Hebrew alt "דנה ויוסי — בני הזוג מתחבקים ביום חתונתם"). Configured `images.remotePatterns` for `images.unsplash.com` in `next.config.js`. CSP already allowed it (`img-src ... https:` + same-origin optimizer). Optimizer confirmed serving the image `200 image/jpeg` at default quality.
- **Typography:** added Cormorant Garamond (Google Fonts, `display=swap`) in `app/layout.tsx`, used only for the couple names + "מתחתנים!".
- **Gold accent `#C9A86C`** (+ soft `#E7D7B8`) used ONLY inside the invitation mockup (borders, divider, RSVP primary, label), via inline styles — not added to the global theme, per the brief.
- Sample content: couple דנה & יוסי, date **שבת, 14.06.2026**, venue **גן האירועים "השמיים", פתח תקווה**, RSVP buttons **אישור הגעה / לא אגיע / טרם החלטתי**. Synced the same date/venue across the RSVP + dashboard screens for consistency (previously 14.08.2026 / ראשון לציון).

## PART 3 — Interactive phone mockup ✅
**Decisions**
- Rewrote `components/PhoneMockup.tsx` to **5 stages** matching the story: invitation → WhatsApp delivery → RSVP → AI follow-up → dashboard (added two new screens: a WhatsApp chat-delivery screen and an AI-call screen with live soundwave + transcript).
- **Clickable tab dots** at the bottom (role="tablist", `aria-selected`/`aria-current`, active dot widened + white). Click changes the screen with a fade transition.
- **Auto-advance preserved but enters manual mode** on any user interaction (click / arrow key / swipe) — `manual` state stops the interval permanently; also pauses on hover. Auto-advance is **disabled entirely for `prefers-reduced-motion`** users (via `matchMedia`).
- **Keyboard accessible:** phone body is `tabIndex=0`, `role="group"`/`aria-roledescription="קרוסלה"`, ArrowRight=previous / ArrowLeft=next (RTL-correct), visible `focus-visible` ring on body + dots. Added an `aria-live="polite"` `sr-only` announcement of the current screen.
- **Touch-swipeable:** swipe left → next, swipe right → previous (40px threshold).
- RSVP screen gained a third option (טרם — "maybe") to match the invitation's three RSVP buttons.

**Files:** `components/PhoneMockup.tsx` (full rewrite), `next.config.js` (images), `app/layout.tsx` (serif font).

## PART 4 — Stronger CTAs (mixed tone, not spammy) ✅
**Decisions** — kept to **5 section-level CTAs** total (the brief's max), spread across the long page:
1. **Hero (confident):** "התחילו בחינם" → **"צרו את ההזמנה שלכם"**.
2. **Mid-page CTA #1 (calm):** new `components/MidPageCTA.tsx` — "מוכנים להתחיל?" band placed after the features section.
3. **Mid-page CTA #2:** kept the existing `JoinBanner` ("היו מהראשונים…") as the second mid-page CTA — it already sits between feature blocks, so rather than add a redundant third band I treated it as CTA #2 (honors "2 mid-page CTAs" without over-cluttering).
4. **Footer (gentle close):** added "יש לכם שאלה? דברו איתנו" band at the top of the footer.
5. **Sticky launch CTA (honest urgency):** new `components/StickyLaunchCTA.tsx` — "תפסו מקום במחירי השקה", floating **bottom-LEFT** (opposite the WhatsApp FAB at bottom-right, so no overlap), appears only after scrolling >600px, dismissible (remembered in `localStorage`). We genuinely are in launch period, so the scarcity is honest.
- All CTAs link to `/#contact` (the lead form). Header button + FloatingWhatsApp are persistent nav, not counted as section CTAs.

**Files:** `components/MidPageCTA.tsx` (new), `components/StickyLaunchCTA.tsx` (new), `components/HeroSection.tsx` (copy), `components/Footer.tsx` (gentle CTA), `app/page.tsx` (placement).

## Technical / validation
- `npm run build` → **success, zero errors**. New `/how-it-works` route prerenders as static (○). Total routes 12.
- Localhost (`next start`) smoke tests confirmed: `/` and `/how-it-works` → 200; homepage contains the new how-it-works CTA, mid-page CTA, confident hero CTA, footer gentle CTA, and the full HowItWorks step blocks are gone; `/how-it-works` contains hero, expanded step bullets, process FAQ, closing CTA; the Unsplash photo serves `200 image/jpeg` through the next/image optimizer at default quality.
- RTL, TypeScript (no `any`), mobile-first, reduced-motion respected (framer-motion `useReducedMotion` in steps; `matchMedia` gate on phone auto-advance; global CSS reduced-motion rule covers the rest).
- Gold `#C9A86C` scoped to the invitation mockup only — not added to the Tailwind theme.

## Limitations / notes
- **No headless browser in this environment**, so I could not click the interactive phone or read the live JS console. Validated via build + SSR/HTTP checks + code review. Verify in a real browser: phone dot/arrow/swipe navigation, focus rings, and a clean console.
- Cookie banner + sticky launch CTA are client-mount-gated, so they're (correctly) absent from server HTML — verify visually in-browser that both still appear/dismiss.
- Photographer attribution left as generic "Unsplash" (see Part 2) — if you want a named credit, tell me the photographer and I'll add it.
- Kept the existing present-tense AI-voice product narrative (already used site-wide); did not change product messaging tonight.

## Did NOT touch (per hard safety rules)
- `.env.local`, `/api/leads`, Twilio integration, Privacy Policy content, no secret rotation, no force push.

## Commit
- `de79eb9` — "Restructure: dedicated /how-it-works page, premium phone mockup, interactive demo, stronger CTAs" — pushed to `origin/main` at 627944e..de79eb9. Vercel auto-deploy triggered.

---

# BUILD_LOG — Bug Fix: phone mockup clicks (2026-06-13T17:41Z)

Operator: Claude (Opus 4.8). Autonomous.

## Symptom
Nav dots/tabs on the interactive phone mockup didn't respond to clicks on the live site — only auto-advance worked.

## Root cause
A CSS stacking / hit-testing bug in `components/PhoneMockup.tsx`. The decorative **glow** div (`absolute -inset-8`, full-bleed blurred gradient) is a *positioned* element with no `pointer-events`. The **nav-tabs container was non-positioned (static)**. Per CSS paint order, positioned siblings render **above** non-positioned ones regardless of DOM order — so the glow overlay sat on top of the dot buttons and swallowed every click. The phone body still worked because it's `relative` (positioned) and later in the DOM; auto-advance worked because it's a timer, not a click. The floating "אישור התקבל" bubble (also `absolute`) had the same latent issue over the phone area.

## Fix
- Added `pointer-events-none` to the decorative **glow** div and the **floating confirmation bubble** (neither should ever intercept input). This is the actual fix.
- Defense-in-depth: gave the tablist `relative z-20` so the controls are explicitly above any decorative layer.
- `goTo(i)` already jumps **directly** to the requested index (`setIndex(i)`), so clicking stage 5 goes straight there without passing through 1–4.
- Auto-advance now **pauses on any interaction** (`manual=true`) and **resumes after 30s of inactivity** (new `RESUME_AFTER_MS` timer via `resumeRef`, cleared on unmount).
- Added `console.log('Stage clicked:', i)` inside the dot `onClick` for live verification.
- Hover/active states retained (active dot widened + white; inactive dots brighten on hover; `focus-visible` rings on body + dots).

## Validation
- `npm run build` → zero errors.
- Read the rendered HTML from `next start`: glow has `pointer-events-none`, tablist is `relative z-20`, bubble has `pointer-events-none`, **5 `role="tab"` buttons** render server-side. Confirmed `console.log('Stage clicked:')` is present in the built client JS chunk.
- (Headless env — couldn't synthesize a real click; verified via rendered HTML + bundle inspection + the now-removed overlay blocker.)

## Files changed
- `components/PhoneMockup.tsx` only.

## Did NOT touch
- `.env.local`, `/api/leads`, Twilio, Privacy Policy. No secret rotation, no force push.

