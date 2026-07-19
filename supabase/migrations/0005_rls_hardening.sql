-- ============================================================================
-- Maorly — Migration 0005: RLS hardening / verification (SECURITY)
-- ----------------------------------------------------------------------------
-- Purpose: GUARANTEE that Row Level Security is enabled and that owner-scoped
-- policies exist on every table, regardless of whether 0001–0003 were fully
-- applied to the live database. Every statement is idempotent and re-asserts
-- the SAME policies audited in 0001–0003 — it does NOT weaken anything.
--
-- PREREQUISITE: run 0001–0004 first (they create the tables + the public.is_admin
-- helper this migration references). Then run this file in the Supabase Dashboard
-- → SQL Editor. Safe to run more than once.
-- ============================================================================

-- ---- 1. Ensure RLS is ENABLED on every table ------------------------------
alter table public.users               enable row level security;
alter table public.feature_access      enable row level security;
alter table public.events              enable row level security;
alter table public.guests              enable row level security;
alter table public.invitations         enable row level security;
alter table public.admin_notifications enable row level security;

-- ---- 2. Re-assert owner-scoped / admin policies ---------------------------
-- users: self or admin (read + update). Role escalation is separately blocked
-- by the guard_user_update trigger from 0001.
drop policy if exists users_select_self_or_admin on public.users;
create policy users_select_self_or_admin on public.users
  for select using (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists users_update_self_or_admin on public.users;
create policy users_update_self_or_admin on public.users
  for update using (id = auth.uid() or public.is_admin(auth.uid()))
  with check (id = auth.uid() or public.is_admin(auth.uid()));

-- feature_access: user reads own (read-only); admin writes.
drop policy if exists feature_access_select_own on public.feature_access;
create policy feature_access_select_own on public.feature_access
  for select using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists feature_access_admin_write on public.feature_access;
create policy feature_access_admin_write on public.feature_access
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- events: owner reads own; admin full.
drop policy if exists events_owner_select on public.events;
create policy events_owner_select on public.events
  for select using (owner_id = auth.uid());

drop policy if exists events_admin_all on public.events;
create policy events_admin_all on public.events
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- guests: parent event's owner, or admin. (CRITICAL — no cross-user reads.)
drop policy if exists guests_owner_all on public.guests;
create policy guests_owner_all on public.guests
  for all using (
    exists (select 1 from public.events e
            where e.id = guests.event_id and e.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.events e
            where e.id = guests.event_id and e.owner_id = auth.uid())
  );

drop policy if exists guests_admin_all on public.guests;
create policy guests_admin_all on public.guests
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- invitations: owner via guest→event chain, or admin. (CRITICAL.)
drop policy if exists invitations_owner_all on public.invitations;
create policy invitations_owner_all on public.invitations
  for all using (
    exists (select 1 from public.guests g
            join public.events e on e.id = g.event_id
            where g.id = invitations.guest_id and e.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.guests g
            join public.events e on e.id = g.event_id
            where g.id = invitations.guest_id and e.owner_id = auth.uid())
  );

drop policy if exists invitations_admin_all on public.invitations;
create policy invitations_admin_all on public.invitations
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- admin_notifications: admins only.
drop policy if exists admin_notifications_admin_all on public.admin_notifications;
create policy admin_notifications_admin_all on public.admin_notifications
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ============================================================================
-- 3. VERIFICATION — run this SELECT after the migration and eyeball the output.
--    Expected: rls_enabled = true for ALL 6 rows, and NO policy whose
--    "using" clause is just "true" (a permissive open policy).
-- ----------------------------------------------------------------------------
-- select c.relname                as table_name,
--        c.relrowsecurity         as rls_enabled,
--        p.polname                as policy_name,
--        pg_get_expr(p.polqual, p.polrelid)     as using_clause
--   from pg_class c
--   join pg_namespace n on n.oid = c.relnamespace
--   left join pg_policy p on p.polrelid = c.oid
--  where n.nspname = 'public'
--    and c.relname in ('users','feature_access','events','guests',
--                      'invitations','admin_notifications')
--  order by table_name, policy_name;
-- ============================================================================
