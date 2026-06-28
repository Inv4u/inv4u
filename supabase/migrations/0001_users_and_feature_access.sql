-- ============================================================================
-- inv4u — Migration 0001: users + feature_access (the locked-dashboard core)
-- ----------------------------------------------------------------------------
-- Business model: accounts are OPEN to anyone (lead capture), but every product
-- feature is LOCKED until Maor unlocks it per-feature after a paid sales call.
-- There is NO whole-account "approval" gate — the gate is per feature, in the
-- feature_access table.
--
-- Apply in the Supabase Dashboard → SQL Editor (run files in order 0001→0003),
-- or via `supabase db push`. Idempotent: safe to run more than once.
-- ============================================================================

-- ---- enums -----------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('event_owner', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.feature_key as enum (
    'whatsapp_invitations',
    'ai_calling',
    'email_backup',
    'live_dashboard',
    'seating_map',
    'guest_management'
  );
exception when duplicate_object then null; end $$;

-- ---- users (1:1 with auth.users) -------------------------------------------
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique,
  phone       text unique,
  full_name   text not null default '',
  role        public.user_role not null default 'event_owner',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint users_has_identifier check (email is not null or phone is not null)
);

-- ---- feature_access (THE KEY TABLE) ----------------------------------------
-- One row per (user, feature). Seeded locked on signup; Maor flips `unlocked`.
create table if not exists public.feature_access (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  feature_key  public.feature_key not null,
  unlocked     boolean not null default false,
  unlocked_at  timestamptz,
  unlocked_by  uuid references public.users(id) on delete set null,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, feature_key)
);
create index if not exists feature_access_user_idx on public.feature_access(user_id);

-- ---- helper: is_admin (SECURITY DEFINER avoids recursive RLS on users) ------
create or replace function public.is_admin(uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.users u where u.id = uid and u.role = 'admin');
$$;

-- ---- keep updated_at fresh --------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_users_touch on public.users;
create trigger trg_users_touch before update on public.users
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_feature_access_touch on public.feature_access;
create trigger trg_feature_access_touch before update on public.feature_access
  for each row execute function public.touch_updated_at();

-- ---- create a user row + seed all 6 locked features on signup --------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, phone, full_name)
  values (
    new.id,
    new.email,
    new.phone,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;

  -- Seed every feature as locked. enum_range yields all feature_key values, so
  -- adding a new feature later automatically seeds for future signups.
  insert into public.feature_access (user_id, feature_key)
  select new.id, k
  from unnest(enum_range(null::public.feature_key)) as k
  on conflict (user_id, feature_key) do nothing;

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---- protect role from self-escalation -------------------------------------
-- A user may update their own profile (name/phone), but may NOT make themselves
-- an admin. Only an admin (or the service-role key, which bypasses RLS) can.
create or replace function public.guard_user_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.is_admin(auth.uid()) then
    return new;  -- admins may change anything
  end if;
  if new.role is distinct from old.role then
    raise exception 'Not allowed to modify role';
  end if;
  return new;
end $$;

drop trigger if exists trg_users_guard on public.users;
create trigger trg_users_guard before update on public.users
  for each row execute function public.guard_user_update();

-- ---- RLS --------------------------------------------------------------------
alter table public.users          enable row level security;
alter table public.feature_access enable row level security;

-- users: a user sees only their own row; admins see all.
drop policy if exists users_select_self_or_admin on public.users;
create policy users_select_self_or_admin on public.users
  for select using (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists users_update_self_or_admin on public.users;
create policy users_update_self_or_admin on public.users
  for update using (id = auth.uid() or public.is_admin(auth.uid()))
  with check (id = auth.uid() or public.is_admin(auth.uid()));

-- feature_access: users read their own (READ-ONLY); admins do everything.
drop policy if exists feature_access_select_own on public.feature_access;
create policy feature_access_select_own on public.feature_access
  for select using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists feature_access_admin_write on public.feature_access;
create policy feature_access_admin_write on public.feature_access
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- No INSERT/DELETE policy for normal users: the user row + feature rows are
-- created by the signup trigger (SECURITY DEFINER), and admin writes use the
-- service-role key (bypasses RLS).

-- ============================================================================
-- After running 0001–0003, create Maor's admin account — see BUILD_LOG.md.
-- ============================================================================
