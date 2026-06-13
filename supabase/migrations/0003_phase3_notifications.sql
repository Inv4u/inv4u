-- ============================================================================
-- Phase 3 — Notifications (admin alerts inbox)
-- Requires Phase 1. The actual email/WhatsApp send REUSES the existing
-- nodemailer + Twilio integration (lib/email.ts, lib/twilio.ts); this table is
-- just the in-app record. See DATABASE_PLAN.md.
-- ============================================================================

do $$ begin
  create type public.notification_type as enum
    ('new_signup', 'approval_needed', 'approved', 'system');
exception when duplicate_object then null; end $$;

create table if not exists public.notifications (
  id                   uuid primary key default gen_random_uuid(),
  type                 public.notification_type not null,
  recipient_profile_id uuid references public.profiles(id) on delete cascade, -- null = admin/Maor
  related_profile_id   uuid references public.profiles(id) on delete set null,
  title                text not null,
  body                 text,
  read_at              timestamptz,
  created_at           timestamptz not null default now()
);
create index if not exists notifications_recipient_idx on public.notifications(recipient_profile_id);

alter table public.notifications enable row level security;

-- Recipients see their own; admins see everything (incl. admin-targeted, where
-- recipient_profile_id is null).
drop policy if exists notifications_select on public.notifications;
create policy notifications_select on public.notifications
  for select using (
    recipient_profile_id = auth.uid() or public.is_admin(auth.uid())
  );

-- Recipients/admins may mark as read.
drop policy if exists notifications_update on public.notifications;
create policy notifications_update on public.notifications
  for update using (
    recipient_profile_id = auth.uid() or public.is_admin(auth.uid())
  )
  with check (
    recipient_profile_id = auth.uid() or public.is_admin(auth.uid())
  );

-- Inserts happen via server code using the service-role key (bypasses RLS).
