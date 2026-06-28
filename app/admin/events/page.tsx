import Link from 'next/link';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import {
  eventTitle,
  formatHebrewDate,
  EVENT_TYPE_LABELS,
  EVENT_STATUS_LABELS,
} from '@/lib/eventLabels';
import type { EventRow, User } from '@/database.types';

export const dynamic = 'force-dynamic';

interface Row extends EventRow {
  ownerName: string;
  ownerId: string;
}

async function getEvents(): Promise<Row[]> {
  const admin = getSupabaseAdmin();
  const [eventsRes, usersRes] = await Promise.all([
    admin.from('events').select('*').order('created_at', { ascending: false }),
    admin.from('users').select('id, full_name, email'),
  ]);
  const events = (eventsRes.data as EventRow[] | null) ?? [];
  const users = (usersRes.data as Pick<User, 'id' | 'full_name' | 'email'>[] | null) ?? [];
  const byId = new Map(users.map((u) => [u.id, u.full_name || u.email || '—']));

  return events.map((e) => ({
    ...e,
    ownerId: e.owner_id,
    ownerName: byId.get(e.owner_id) ?? '—',
  }));
}

export default async function AdminEventsPage() {
  let rows: Row[] = [];
  try {
    rows = await getEvents();
  } catch {
    rows = [];
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-brand-navy sm:text-3xl">אירועים</h1>
      <p className="mt-2 text-slate-600">כל האירועים שנוצרו במערכת.</p>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-white p-8 text-center text-slate-400 ring-1 ring-slate-100">
          עדיין אין אירועים. צרו אירוע מתוך כרטיס משתמש.
        </p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3 font-bold">אירוע</th>
                <th className="px-4 py-3 font-bold">סוג</th>
                <th className="px-4 py-3 font-bold">בעלים</th>
                <th className="px-4 py-3 font-bold">תאריך</th>
                <th className="px-4 py-3 font-bold">סטטוס</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((e) => (
                <tr key={e.id} className="transition hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-brand-navy">
                    {eventTitle(e)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {EVENT_TYPE_LABELS[e.event_type]}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/users/${e.ownerId}`}
                      className="font-bold text-brand-blue hover:underline"
                    >
                      {e.ownerName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {formatHebrewDate(e.event_date) || '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {EVENT_STATUS_LABELS[e.status]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
