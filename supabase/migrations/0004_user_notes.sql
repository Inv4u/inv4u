-- ============================================================================
-- inv4u — Migration 0004: user-level deal notes
-- Adds a free-text notes column on users for Maor to record deal/call details
-- in the /admin user detail screen (distinct from feature_access.notes, which
-- is per-feature). Requires 0001.
-- ============================================================================

alter table public.users add column if not exists notes text;
