'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServer } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { notifyUserApproved } from '@/lib/notify';
import type { Profile } from '@/database.types';

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
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  const role = (data as { role?: string } | null)?.role;
  return role === 'admin' ? user.id : null;
}

/** Approve a pending user, then notify them (best-effort). */
export async function approveUser(userId: string): Promise<ActionResult> {
  const adminId = await requireAdmin();
  if (!adminId) return { ok: false, error: 'אין הרשאה' };

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from('profiles')
    .update({
      approved: true,
      approved_by: adminId,
      approved_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select('*')
    .maybeSingle();

  if (error) return { ok: false, error: error.message };

  const profile = data as unknown as Profile | null;
  if (profile) {
    await notifyUserApproved({
      fullName: profile.full_name,
      email: profile.email,
      phone: profile.phone,
    });
  }

  revalidatePath('/admin');
  return { ok: true };
}

/** Revoke approval (in case of mistakes). */
export async function revokeUser(userId: string): Promise<ActionResult> {
  const adminId = await requireAdmin();
  if (!adminId) return { ok: false, error: 'אין הרשאה' };

  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from('profiles')
    .update({ approved: false, approved_by: null, approved_at: null })
    .eq('id', userId);

  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin');
  return { ok: true };
}
