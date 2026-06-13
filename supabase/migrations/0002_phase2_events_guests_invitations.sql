-- ============================================================================
-- Phase 2 — Core data: events, guests, invitations (+ RLS, + public RSVP RPCs)
-- Requires Phase 1. See DATABASE_PLAN.md.
-- ============================================================================

-- ---- enums -----------------------------------------------------------------
do $$ begin
  create type public.event_type as enum
    ('wedding', 'bar_mitzvah', 'bat_mitzvah', 'brit', 'corporate', 'other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.event_status as enum ('draft', 'active', 'completed', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.rsvp_status as enum ('pending', 'attending', 'not_attending', 'maybe');
exception when duplicate_object then null; end $$;

-- ---- events ----------------------------------------------------------------
create table if not exists public.events (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references public.profiles(id) on delete cascade,
  event_type    public.event_type not null default 'other',
  event_date    date,
  venue_name    text,
  venue_address text,
  couple_name_1 text,
  couple_name_2 text,
  honoree_name  text,
  status        public.event_status not null default 'draft',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists events_owner_idx on public.events(owner_id);

drop trigger if exists trg_events_touch on public.events;
create trigger trg_events_touch before update on public.events
  for each row execute function public.touch_updated_at();

-- ---- guests ----------------------------------------------------------------
create table if not exists public.guests (
  id               uuid primary key default gen_random_uuid(),
  event_id         uuid not null references public.events(id) on delete cascade,
  full_name        text not null,
  phone            text,
  party_size       int not null default 1 check (party_size >= 0),
  rsvp_status      public.rsvp_status not null default 'pending',
  rsvp_response_at timestamptz,
  invite_token     uuid not null unique default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists guests_event_idx on public.guests(event_id);
create index if not exists guests_token_idx on public.guests(invite_token);

drop trigger if exists trg_guests_touch on public.guests;
create trigger trg_guests_touch before update on public.guests
  for each row execute function public.touch_updated_at();

-- ---- invitations -----------------------------------------------------------
create table if not exists public.invitations (
  id                  uuid primary key default gen_random_uuid(),
  guest_id            uuid not null references public.guests(id) on delete cascade,
  channel             text not null default 'whatsapp',
  sent_at             timestamptz,
  delivered_at        timestamptz,
  opened_at           timestamptz,
  whatsapp_message_id text,
  created_at          timestamptz not null default now()
);
create index if not exists invitations_guest_idx on public.invitations(guest_id);

-- ---- RLS -------------------------------------------------------------------
alter table public.events      enable row level security;
alter table public.guests      enable row level security;
alter table public.invitations enable row level security;

-- events: owner (must be approved) full CRUD; admin can read all
drop policy if exists events_owner_all on public.events;
create policy events_owner_all on public.events
  for all using (owner_id = auth.uid() and public.is_approved(auth.uid()))
  with check (owner_id = auth.uid() and public.is_approved(auth.uid()));

drop policy if exists events_admin_read on public.events;
create policy events_admin_read on public.events
  for select using (public.is_admin(auth.uid()));

-- guests: visible/editable to the parent event's owner (approved) or admin
drop policy if exists guests_owner_all on public.guests;
create policy guests_owner_all on public.guests
  for all using (
    exists (select 1 from public.events e
            where e.id = guests.event_id
              and e.owner_id = auth.uid()
              and public.is_approved(auth.uid()))
  )
  with check (
    exists (select 1 from public.events e
            where e.id = guests.event_id
              and e.owner_id = auth.uid()
              and public.is_approved(auth.uid()))
  );

drop policy if exists guests_admin_read on public.guests;
create policy guests_admin_read on public.guests
  for select using (public.is_admin(auth.uid()));

-- invitations: owner via guest→event chain, or admin
drop policy if exists invitations_owner_all on public.invitations;
create policy invitations_owner_all on public.invitations
  for all using (
    exists (select 1 from public.guests g
            join public.events e on e.id = g.event_id
            where g.id = invitations.guest_id
              and e.owner_id = auth.uid()
              and public.is_approved(auth.uid()))
  )
  with check (
    exists (select 1 from public.guests g
            join public.events e on e.id = g.event_id
            where g.id = invitations.guest_id
              and e.owner_id = auth.uid()
              and public.is_approved(auth.uid()))
  );

drop policy if exists invitations_admin_read on public.invitations;
create policy invitations_admin_read on public.invitations
  for select using (public.is_admin(auth.uid()));

-- ---- Public RSVP via invite_token (NO login) -------------------------------
-- SECURITY DEFINER RPCs expose ONLY the single guest row for a given token,
-- so the WhatsApp link flow never gets broad table access.

create or replace function public.get_guest_by_token(token uuid)
returns table (
  guest_id uuid, full_name text, party_size int, rsvp_status public.rsvp_status,
  event_type public.event_type, event_date date, venue_name text, venue_address text,
  couple_name_1 text, couple_name_2 text, honoree_name text
)
language sql stable security definer set search_path = public as $$
  select g.id, g.full_name, g.party_size, g.rsvp_status,
         e.event_type, e.event_date, e.venue_name, e.venue_address,
         e.couple_name_1, e.couple_name_2, e.honoree_name
  from public.guests g
  join public.events e on e.id = g.event_id
  where g.invite_token = token;
$$;

create or replace function public.respond_rsvp(
  token uuid, new_status public.rsvp_status, new_party_size int default null
)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.guests
     set rsvp_status      = new_status,
         party_size       = coalesce(new_party_size, party_size),
         rsvp_response_at = now()
   where invite_token = token;
  if not found then
    raise exception 'Invalid invite token';
  end if;
end $$;

-- Allow anonymous (anon) + logged-in (authenticated) callers to use the RPCs.
grant execute on function public.get_guest_by_token(uuid) to anon, authenticated;
grant execute on function public.respond_rsvp(uuid, public.rsvp_status, int) to anon, authenticated;
