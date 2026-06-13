-- ============================================================================
-- Phase 1 — Auth foundation: profiles + approval gate
-- Run in Supabase SQL Editor (or `supabase db push`). Safe to run once, in order.
-- See DATABASE_PLAN.md for the full design.
-- ============================================================================

-- ---- enum ------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('event_owner', 'admin');
exception when duplicate_object then null; end $$;

-- ---- profiles (1:1 with auth.users) ----------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text unique,
  phone        text unique,
  full_name    text not null default '',
  approved     boolean not null default false,           -- ⬅ the approval gate
  approved_by  uuid references public.profiles(id),
  approved_at  timestamptz,
  role         public.user_role not null default 'event_owner',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint profiles_has_identifier check (email is not null or phone is not null)
);

-- ---- helper functions (SECURITY DEFINER avoids recursive RLS on profiles) ---
create or replace function public.is_admin(uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = uid and p.role = 'admin');
$$;

create or replace function public.is_approved(uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = uid and p.approved = true);
$$;

-- ---- keep updated_at fresh --------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ---- create a profile automatically on signup ------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, phone, full_name)
  values (
    new.id,
    new.email,
    new.phone,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---- protect privileged columns from self-escalation -----------------------
-- A normal user may update their own row, but may NOT change approved/role/etc.
create or replace function public.guard_profile_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.is_admin(auth.uid()) then
    return new;  -- admins may change anything
  end if;
  if new.approved   is distinct from old.approved
     or new.role        is distinct from old.role
     or new.approved_by is distinct from old.approved_by
     or new.approved_at is distinct from old.approved_at then
    raise exception 'Not allowed to modify privileged profile columns';
  end if;
  return new;
end $$;

drop trigger if exists trg_profiles_guard on public.profiles;
create trigger trg_profiles_guard before update on public.profiles
  for each row execute function public.guard_profile_update();

-- ---- RLS --------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists profiles_select_self_or_admin on public.profiles;
create policy profiles_select_self_or_admin on public.profiles
  for select using (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists profiles_update_self_or_admin on public.profiles;
create policy profiles_update_self_or_admin on public.profiles
  for update using (id = auth.uid() or public.is_admin(auth.uid()))
  with check (id = auth.uid() or public.is_admin(auth.uid()));

-- No INSERT/DELETE policies: inserts happen via the signup trigger (definer),
-- and the service-role key (used by admin server code) bypasses RLS.

-- ============================================================================
-- After running: promote your own account to admin + approved (see BUILD_LOG):
--   update public.profiles set role='admin', approved=true, approved_at=now()
--   where email = 'YOUR_ADMIN_EMAIL';
-- ============================================================================
