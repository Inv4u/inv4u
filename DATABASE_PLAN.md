# DATABASE_PLAN.md — Auth & Schema Design Proposal

**Status:** Proposal for review. **No tables are built from this document** — it is the
design that Task 3 implements as Supabase migration files.

**Author:** Claude (Opus 4.8), 2026-06-13. **Owner/approver:** Maor.

---

## 1. Tech stack

- **Database:** Supabase (PostgreSQL) — already in use for the `leads` table.
- **Auth:** Supabase Auth (`auth.users`) — handles password hashing, sessions, JWT.
- **Server access:** service-role key for admin/notification paths (already wired in
  `lib/supabase.ts`); per-user access via `@supabase/ssr` cookie sessions.
- **Authorization:** PostgreSQL **Row Level Security (RLS)** on every app table.

> The existing `leads` table and `/api/leads` flow are **independent of this schema** and
> stay exactly as they are. Nothing here touches them.

### Key design decision — the `approved` gate
Per the brief, **no signed-up user can do anything until Maor approves them.** This is
enforced in **two layers**:
1. A `profiles.approved BOOLEAN DEFAULT false` column, and
2. **RLS policies that check `approved = true`** before allowing any read/write on
   `events`/`guests`/`invitations`. Approval is not just a UI redirect — the database
   itself refuses unapproved users. (Belt and suspenders: middleware also redirects.)

---

## 2. The `auth.users` ↔ `profiles` split (important)

Supabase Auth owns the `auth.users` table (email, phone, encrypted password, etc.). We
**do not** add columns to it. Instead we create a **`public.profiles`** table with a
1:1 FK to `auth.users(id)`, holding our app-specific fields (`approved`, `role`, …). A
trigger creates the profile row automatically on signup.

This is the standard Supabase pattern and keeps Auth upgrades safe.

---

## 3. Schema

### 3.1 `profiles` (the "user model")
| column | type | notes |
|---|---|---|
| `id` | `uuid` PK | = `auth.users.id` (FK, `on delete cascade`) |
| `email` | `text` unique nullable | mirror of auth email; unique if present |
| `phone` | `text` unique nullable | mirror of auth phone; unique if present |
| `full_name` | `text` not null | |
| `approved` | `boolean` not null default **false** | ⬅ the gate |
| `approved_by` | `uuid` nullable | FK → `profiles.id` (the admin who approved) |
| `approved_at` | `timestamptz` nullable | |
| `role` | `user_role` enum | `'event_owner'` \| `'admin'`, default `'event_owner'` |
| `created_at` | `timestamptz` default `now()` | |
| `updated_at` | `timestamptz` default `now()` | maintained by trigger |

- Password is **not** here — Supabase Auth owns it.
- **Constraint:** `CHECK (email IS NOT NULL OR phone IS NOT NULL)` — at least one identifier.
- Email/phone are mirrored from `auth.users` by the signup trigger so RLS/admin queries
  don't need to read the `auth` schema.

### 3.2 `events`
| column | type | notes |
|---|---|---|
| `id` | `uuid` PK default `gen_random_uuid()` | |
| `owner_id` | `uuid` not null | FK → `profiles.id` (`on delete cascade`) |
| `event_type` | `event_type` enum | `'wedding'`\|`'bar_mitzvah'`\|`'bat_mitzvah'`\|`'brit'`\|`'corporate'`\|`'other'` |
| `event_date` | `date` nullable | approximate allowed |
| `venue_name` | `text` nullable | |
| `venue_address` | `text` nullable | |
| `couple_name_1` | `text` nullable | bride/groom/host 1 |
| `couple_name_2` | `text` nullable | partner 2 (null for non-couple events) |
| `honoree_name` | `text` nullable | for bar/bat mitzvah, brit, etc. |
| `status` | `event_status` enum | `'draft'`\|`'active'`\|`'completed'`\|`'archived'`, default `'draft'` |
| `created_at` / `updated_at` | `timestamptz` | |

### 3.3 `guests`
| column | type | notes |
|---|---|---|
| `id` | `uuid` PK | |
| `event_id` | `uuid` not null | FK → `events.id` (`on delete cascade`) |
| `full_name` | `text` not null | |
| `phone` | `text` nullable | |
| `party_size` | `int` not null default 1 | `CHECK (party_size >= 0)` |
| `rsvp_status` | `rsvp_status` enum | `'pending'`\|`'attending'`\|`'not_attending'`\|`'maybe'`, default `'pending'` |
| `rsvp_response_at` | `timestamptz` nullable | |
| `invite_token` | `uuid` unique not null default `gen_random_uuid()` | used in the WhatsApp link **instead of login** |
| `created_at` / `updated_at` | `timestamptz` | |

- `invite_token` is the **public capability** — anyone with the link can view/answer that
  one guest's RSVP without an account. Index it (`unique`).

### 3.4 `invitations`
| column | type | notes |
|---|---|---|
| `id` | `uuid` PK | |
| `guest_id` | `uuid` not null | FK → `guests.id` (`on delete cascade`) |
| `sent_at` | `timestamptz` nullable | |
| `delivered_at` | `timestamptz` nullable | |
| `opened_at` | `timestamptz` nullable | |
| `whatsapp_message_id` | `text` nullable | Twilio message SID |
| `channel` | `text` default `'whatsapp'` | `'whatsapp'`\|`'sms'` (future) |
| `created_at` | `timestamptz` | |

### 3.5 `notifications` (Maor's admin alerts)
| column | type | notes |
|---|---|---|
| `id` | `uuid` PK | |
| `type` | `notification_type` enum | `'new_signup'`\|`'approval_needed'`\|`'approved'`\|`'system'` |
| `recipient_profile_id` | `uuid` nullable | who it's for (null = admin/Maor) |
| `related_profile_id` | `uuid` nullable | e.g. the user who signed up |
| `title` | `text` not null | |
| `body` | `text` nullable | |
| `read_at` | `timestamptz` nullable | |
| `created_at` | `timestamptz` default `now()` | |

> The actual email/WhatsApp send **reuses the existing Twilio + nodemailer integration**
> (`lib/twilio.ts`, `lib/email.ts`) — this table is just the in-app record/inbox.

### Enums to create
`user_role`, `event_type`, `event_status`, `rsvp_status`, `notification_type`.

---

## 4. Row Level Security (RLS) policies

RLS **enabled on all five tables**. A `SECURITY DEFINER` helper `is_admin(uid)` checks
`role='admin'` (avoids recursive RLS on `profiles`).

### `profiles`
- **select:** `id = auth.uid()` OR `is_admin(auth.uid())`.
- **update:** `id = auth.uid()` **but** a normal user **cannot change** `approved`,
  `role`, `approved_by`, `approved_at` (enforced via a trigger/`WITH CHECK` that rejects
  changes to protected columns unless `is_admin`). Admins can update anyone.
- **insert:** handled by the signup trigger (`SECURITY DEFINER`); no direct client insert.

### `events`
- **all (CRUD):** `owner_id = auth.uid()` **AND the owner is approved** (`is_approved(auth.uid())`),
  OR `is_admin(auth.uid())` (admins read-all; edit optional).

### `guests`
- **owner/admin:** visible/editable when the parent event's `owner_id = auth.uid()` (and
  approved) or `is_admin`.
- **public via token:** a dedicated policy / `SECURITY DEFINER` RPC `get_guest_by_token(token)`
  + `respond_rsvp(token, status, party_size)` so the WhatsApp link flow can read+update
  **only that one guest row**, no auth required. (Prefer RPC over a broad public SELECT
  policy so we never expose the whole table.)

### `invitations`
- **owner/admin** via the guest→event chain. No public access (analytics are private).

### `notifications`
- **select/update:** `recipient_profile_id = auth.uid()` OR `is_admin`. Admin-targeted
  rows (recipient null) visible to admins only. Inserts via `SECURITY DEFINER` server code.

---

## 5. Auth flow

```
Signup (email OR phone + password + name)
   → auth.users row created by Supabase Auth
   → trigger creates profiles row: approved=false, role='event_owner'
   → server sends: email to inv4u.business@gmail.com + WhatsApp to Maor   [reuses lib/twilio.ts + lib/email.ts]
   → insert notifications row (type='approval_needed')
   → user redirected to /pending ("ממתין לאישור")
Maor opens /admin → sees pending users → clicks Approve
   → profiles.approved=true, approved_by=<maor>, approved_at=now()
   → server sends approval email + WhatsApp to the user
User logs in → approved=true → /dashboard.  (approved=false → /pending.)
```

RLS guarantees that even if a user reaches `/dashboard` early, the database returns
nothing until `approved=true`.

---

## 6. Migration plan (phased)

- **Phase 1 — Auth foundation:** enums + `profiles` table + signup trigger + `is_admin`/
  `is_approved` helpers + `profiles` RLS. *(Task 3)*
- **Phase 2 — Core data:** `events`, `guests`, `invitations` + their RLS + the public
  token RPCs. *(Task 3)*
- **Phase 3 — Notifications & admin:** `notifications` table + admin features + wiring the
  approval/signup sends to the existing Twilio/email integration. *(Tasks 3–4)*

Each phase = one timestamped file in `supabase/migrations/`. Safe to apply in order via
the Supabase SQL editor or `supabase db push`.

---

## 7. New environment variables (placeholders → `.env.example`)
- `NEXT_PUBLIC_SUPABASE_URL` (already used)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (already used; needed for client auth)
- `SUPABASE_SERVICE_ROLE_KEY` (new name for the service key used by admin/notification code)
- `ADMIN_NOTIFICATION_EMAIL` (where new-signup alerts go; default `inv4u.business@gmail.com`)

---

## 8. Privacy / legal note
This schema introduces **new personal-data collection** (account holders' names, emails,
phones, passwords-via-Auth, and their guests' names/phones). Under the Israeli Privacy
Protection Law + GDPR, the **Privacy Policy must be updated** before this goes live
(what we collect, why, retention, the approval process, guest data as processor). Flagged
for Maor — **not changing the policy in this build** (hard rule), but it is a launch
blocker for the auth feature.

---

## 9. Open questions for Maor
1. **Identifier uniqueness:** if someone signs up with phone only, later adds email —
   merge or keep separate? (Plan assumes one `auth.users` per person.)
2. **Self-signup vs invite-only:** should signup be open to the public (then you approve),
   or should you create accounts yourself? Affects how aggressively we rate-limit `/signup`.
3. **Admin count:** just you, or will staff get `admin` later? (Schema already supports N admins.)
4. **Guest phone privacy:** guests never sign up — are you comfortable storing their
   phone numbers under your account as the data controller? (Likely yes; confirm for the policy.)
5. **Event ↔ owner cardinality:** one owner → many events assumed. Any need for
   co-owners/collaborators on a single event? (Would add a join table later.)
6. **Data retention:** auto-archive/delete events + guest PII some months after the event date?
7. **RSVP edits:** can a guest change their answer unlimited times via the token, or lock
   after the event date?
8. **Anything missing / edge cases you're worried about?**
