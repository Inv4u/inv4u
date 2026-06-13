import { createClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client — **server-only**. Bypasses RLS, so NEVER import
 * this into a client component. Used for admin actions (approving users) and
 * for inserting notification records.
 *
 * Intentionally untyped: it performs privileged writes and its results are
 * validated/cast at the call site. (Reads through the session/browser clients
 * keep the `Database` generic where typing actually helps.)
 *
 * Reads SUPABASE_SERVICE_ROLE_KEY, falling back to the legacy SUPABASE_SERVICE_KEY
 * name that the existing /api/leads flow already uses — so it works with the
 * current env without forcing a new variable immediately.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  if (!serviceKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY (or legacy SUPABASE_SERVICE_KEY)'
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
