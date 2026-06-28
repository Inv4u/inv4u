import { getSupabaseAdmin } from '@/lib/supabase/admin';
import UsersTable, { type UserRowData } from '@/components/admin/UsersTable';
import type { User, FeatureAccess, EventRow } from '@/database.types';

export const dynamic = 'force-dynamic';

async function getUsers(): Promise<UserRowData[]> {
  const admin = getSupabaseAdmin();
  const [usersRes, featRes, eventsRes] = await Promise.all([
    admin.from('users').select('*').order('created_at', { ascending: false }),
    admin.from('feature_access').select('user_id, unlocked'),
    admin.from('events').select('owner_id'),
  ]);

  const users = (usersRes.data as User[] | null) ?? [];
  const feats = (featRes.data as Pick<FeatureAccess, 'user_id' | 'unlocked'>[] | null) ?? [];
  const events = (eventsRes.data as Pick<EventRow, 'owner_id'>[] | null) ?? [];

  const unlockedByUser = new Map<string, number>();
  for (const f of feats) {
    if (f.unlocked) unlockedByUser.set(f.user_id, (unlockedByUser.get(f.user_id) ?? 0) + 1);
  }
  const eventsByUser = new Map<string, number>();
  for (const e of events) {
    eventsByUser.set(e.owner_id, (eventsByUser.get(e.owner_id) ?? 0) + 1);
  }

  return users.map((u) => ({
    id: u.id,
    full_name: u.full_name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    created_at: u.created_at,
    unlockedCount: unlockedByUser.get(u.id) ?? 0,
    eventCount: eventsByUser.get(u.id) ?? 0,
  }));
}

export default async function AdminUsersPage() {
  let rows: UserRowData[] = [];
  try {
    rows = await getUsers();
  } catch {
    rows = [];
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-brand-navy sm:text-3xl">משתמשים</h1>
      <p className="mt-2 text-slate-600">
        כל מי שנרשם. לחצו על משתמש כדי לפתוח פיצ&apos;רים ולנהל את האירוע שלו.
      </p>
      <div className="mt-6">
        <UsersTable rows={rows} />
      </div>
    </div>
  );
}
