'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServer } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import type { FeatureKey, EventType } from '@/database.types';

export interface ActionResult {
  ok: boolean;
  error?: string;
}

/** Verify the caller is a logged-in admin; returns their user id or null. */
async function requireAdmin(): Promise<string | null> {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  return (data as { role?: string } | null)?.role === 'admin' ? user.id : null;
}

/** Unlock / lock one feature for a user (instant toggle from the admin UI). */
export async function toggleFeature(
  userId: string,
  featureKey: FeatureKey,
  unlocked: boolean
): Promise<ActionResult> {
  const adminId = await requireAdmin();
  if (!adminId) return { ok: false, error: 'אין הרשאה' };

  const admin = getSupabaseAdmin();
  // Upsert so it works even if a feature row is somehow missing.
  const { error } = await admin.from('feature_access').upsert(
    {
      user_id: userId,
      feature_key: featureKey,
      unlocked,
      unlocked_at: unlocked ? new Date().toISOString() : null,
      unlocked_by: unlocked ? adminId : null,
    },
    { onConflict: 'user_id,feature_key' }
  );
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/users/${userId}`);
  revalidatePath('/admin/users');
  return { ok: true };
}

/** Save Maor's free-text deal notes on a user. */
export async function saveUserNotes(
  userId: string,
  notes: string
): Promise<ActionResult> {
  const adminId = await requireAdmin();
  if (!adminId) return { ok: false, error: 'אין הרשאה' };

  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from('users')
    .update({ notes })
    .eq('id', userId);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/users/${userId}`);
  return { ok: true };
}

export interface CreateEventInput {
  event_type: EventType;
  event_date?: string | null;
  venue_name?: string | null;
  venue_address?: string | null;
  couple_name_1?: string | null;
  couple_name_2?: string | null;
  honoree_name?: string | null;
}

/** Create an event owned by a given user. */
export async function createEventForUser(
  userId: string,
  input: CreateEventInput
): Promise<ActionResult> {
  const adminId = await requireAdmin();
  if (!adminId) return { ok: false, error: 'אין הרשאה' };

  const admin = getSupabaseAdmin();
  const { error } = await admin.from('events').insert({
    owner_id: userId,
    event_type: input.event_type,
    event_date: input.event_date || null,
    venue_name: input.venue_name || null,
    venue_address: input.venue_address || null,
    couple_name_1: input.couple_name_1 || null,
    couple_name_2: input.couple_name_2 || null,
    honoree_name: input.honoree_name || null,
    status: 'active',
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/users/${userId}`);
  revalidatePath('/admin/events');
  return { ok: true };
}

/** Mark an admin notification as read. */
export async function markNotificationRead(id: string): Promise<ActionResult> {
  const adminId = await requireAdmin();
  if (!adminId) return { ok: false, error: 'אין הרשאה' };

  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from('admin_notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin/notifications');
  revalidatePath('/admin');
  return { ok: true };
}
