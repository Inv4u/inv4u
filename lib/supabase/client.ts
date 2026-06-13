'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/database.types';

/**
 * Browser Supabase client (anon key) for use inside client components — auth
 * forms, RSVP pages, etc. Safe to expose: the anon key only grants what RLS
 * allows. Created lazily and memoised per tab.
 */
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowser() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  browserClient = createBrowserClient<Database>(url, anonKey);
  return browserClient;
}
