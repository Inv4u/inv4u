'use client';

import { getSupabaseBrowser } from '@/lib/supabase/client';
import type { Profile } from '@/database.types';

/**
 * Client-side auth helpers built on Supabase Auth. Accounts are created with
 * `approved=false` (enforced by the DB trigger + RLS); a user can sign in but
 * can't use any feature until Maor approves them.
 */

export interface AuthResult {
  ok: boolean;
  error?: string;
  userId?: string;
}

/** True if the identifier looks like an email (otherwise treated as a phone). */
function isEmail(identifier: string): boolean {
  return identifier.includes('@');
}

/** Normalise an Israeli phone to E.164 (+972…) for Supabase Auth. */
function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.startsWith('972')) return `+${cleaned}`;
  if (cleaned.startsWith('0')) return `+972${cleaned.slice(1)}`;
  return cleaned;
}

/** Build the credential object for either an email or a phone identifier. */
function credentials(identifier: string, password: string) {
  return isEmail(identifier)
    ? { email: identifier.trim().toLowerCase(), password }
    : { phone: normalizePhone(identifier), password };
}

/**
 * Sign up with email OR phone + password. `full_name` is stored in auth user
 * metadata and copied into `profiles` by the DB trigger.
 */
export async function signUp(
  identifier: string,
  password: string,
  fullName: string
): Promise<AuthResult> {
  const supabase = getSupabaseBrowser();
  const { data, error } = await supabase.auth.signUp({
    ...credentials(identifier, password),
    options: { data: { full_name: fullName.trim() } },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, userId: data.user?.id };
}

/** Sign in with email OR phone + password. */
export async function signIn(
  identifier: string,
  password: string
): Promise<AuthResult> {
  const supabase = getSupabaseBrowser();
  const { data, error } = await supabase.auth.signInWithPassword(
    credentials(identifier, password)
  );
  if (error) return { ok: false, error: error.message };
  return { ok: true, userId: data.user?.id };
}

/** Sign out the current session. */
export async function signOut(): Promise<void> {
  const supabase = getSupabaseBrowser();
  await supabase.auth.signOut();
}

/** The current user's profile row, or null if not logged in. */
export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = getSupabaseBrowser();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  return (profile as unknown as Profile | null) ?? null;
}

/** Whether the current user has been approved by an admin. */
export async function isApproved(): Promise<boolean> {
  const profile = await getCurrentUser();
  return profile?.approved === true;
}
