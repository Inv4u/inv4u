'use client';

import { getSupabaseBrowser } from '@/lib/supabase/client';
import type { User, FeatureAccess, FeatureKey } from '@/database.types';

/**
 * Client-side auth helpers built on Supabase Auth.
 *
 * Business model: signup is OPEN (lead capture). A new account can sign in and
 * see the dashboard immediately — but every feature is LOCKED (rows seeded in
 * `feature_access` with unlocked=false by the DB signup trigger) until Maor
 * unlocks them per-feature from /admin after a paid call. There is no
 * whole-account approval gate.
 */

export interface AuthResult {
  ok: boolean;
  error?: string;
  userId?: string;
}

export interface SignUpParams {
  email?: string;
  phone?: string;
  password: string;
  full_name: string;
}

export interface SignInParams {
  email_or_phone: string;
  password: string;
}

/** True if the identifier looks like an email (otherwise treated as a phone). */
function isEmail(identifier: string): boolean {
  return identifier.includes('@');
}

/** Normalise an Israeli phone to E.164 (+972…) for Supabase Auth. */
export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.startsWith('972')) return `+${cleaned}`;
  if (cleaned.startsWith('0')) return `+972${cleaned.slice(1)}`;
  return cleaned;
}

/** Build the credential object for either an email or a phone identifier. */
function credentialsFor(identifier: string, password: string) {
  return isEmail(identifier)
    ? { email: identifier.trim().toLowerCase(), password }
    : { phone: normalizePhone(identifier), password };
}

/**
 * Sign up with email OR phone + password. `full_name` is stored in auth user
 * metadata; the DB trigger copies it into `users` and seeds the 6 locked
 * features.
 */
export async function signUp({
  email,
  phone,
  password,
  full_name,
}: SignUpParams): Promise<AuthResult> {
  const supabase = getSupabaseBrowser();
  const identifier = (email || phone || '').trim();
  const { data, error } = await supabase.auth.signUp({
    ...credentialsFor(identifier, password),
    options: { data: { full_name: full_name.trim() } },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, userId: data.user?.id };
}

/** Sign in with email OR phone + password. */
export async function signIn({
  email_or_phone,
  password,
}: SignInParams): Promise<AuthResult> {
  const supabase = getSupabaseBrowser();
  const { data, error } = await supabase.auth.signInWithPassword(
    credentialsFor(email_or_phone, password)
  );
  if (error) return { ok: false, error: error.message };
  return { ok: true, userId: data.user?.id };
}

/** Sign out the current session. */
export async function signOut(): Promise<void> {
  const supabase = getSupabaseBrowser();
  await supabase.auth.signOut();
}

/** The current user's `users` row, or null if not logged in. */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabaseBrowser();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  return (data as User | null) ?? null;
}

/** All 6 feature_access rows for a user (RLS lets a user read only their own). */
export async function getUserFeatures(
  userId: string
): Promise<FeatureAccess[]> {
  const supabase = getSupabaseBrowser();
  const { data } = await supabase
    .from('feature_access')
    .select('*')
    .eq('user_id', userId);
  return (data as FeatureAccess[] | null) ?? [];
}

/** Whether a specific feature is unlocked for a user. */
export async function hasFeature(
  userId: string,
  featureKey: FeatureKey
): Promise<boolean> {
  const supabase = getSupabaseBrowser();
  const { data } = await supabase
    .from('feature_access')
    .select('unlocked')
    .eq('user_id', userId)
    .eq('feature_key', featureKey)
    .maybeSingle();
  return (data as { unlocked?: boolean } | null)?.unlocked === true;
}
