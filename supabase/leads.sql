-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Creates the table that the /api/leads route inserts into.

create table if not exists public.leads (
  id          bigint generated always as identity primary key,
  name        text        not null,
  phone       text        not null,
  email       text        not null,
  created_at  timestamptz not null default now()
);

-- Keep leads private: enable RLS with no public policies.
-- The app writes via the service-role key, which bypasses RLS, so inserts
-- still work while the anon (browser) key cannot read or write this table.
alter table public.leads enable row level security;
