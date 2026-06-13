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

