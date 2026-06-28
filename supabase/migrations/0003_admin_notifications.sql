-- ============================================================================
-- inv4u — Migration 0003: admin_notifications (Maor's alerts inbox)
-- Requires 0001. The actual email/WhatsApp send REUSES the existing nodemailer
-- + Twilio integration (lib/email.ts, lib/twilio.ts); this table is the in-app
-- record Maor sees in /admin.
-- ============================================================================

do $$ begin
  create type public.notification_type as enum
    ('new_signup', 'rsvp_received', 'lead_inquiry', 'system_alert');
exception when duplicate_object then null; end $$;

create table if not exists public.admin_notifications (
  id               uuid primary key default gen_random_uuid(),
  type             public.notification_type not null,
  title            text not null,
  body             text,
  read_at          timestamptz,
  related_user_id  uuid references public.users(id)  on delete set null,
  related_event_id uuid references public.events(id) on delete set null,
  created_at       timestamptz not null default now()
);
create index if not exists admin_notifications_unread_idx
  on public.admin_notifications(read_at) where read_at is null;
create index if not exists admin_notifications_created_idx
  on public.admin_notifications(created_at desc);

alter table public.admin_notifications enable row level security;

-- Admins only — for everything.
drop policy if exists admin_notifications_admin_all on public.admin_notifications;
create policy admin_notifications_admin_all on public.admin_notifications
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Inserts in practice happen via server code using the service-role key
-- (bypasses RLS) — e.g. the signup notification route.
