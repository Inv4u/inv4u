import Link from 'next/link';
import { Users, UserPlus, Calendar, Bell, type LucideIcon } from 'lucide-react';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import type { AdminNotification } from '@/database.types';

export const dynamic = 'force-dynamic';

async function getStats() {
  const admin = getSupabaseAdmin();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [totalUsers, newUsers, activeEvents, pendingNotifs, recent] =
    await Promise.all([
      admin.from('users').select('*', { count: 'exact', head: true }),
      admin
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', since),
      admin
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
      admin
        .from('admin_notifications')
        .select('*', { count: 'exact', head: true })
        .is('read_at', null),
      admin
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

  return {
    totalUsers: totalUsers.count ?? 0,
    newUsers: newUsers.count ?? 0,
    activeEvents: activeEvents.count ?? 0,
    pendingNotifs: pendingNotifs.count ?? 0,
    recent: (recent.data as AdminNotification[] | null) ?? [],
  };
}

export default async function AdminHome() {
  let stats;
  try {
    stats = await getStats();
  } catch {
    stats = {
      totalUsers: 0,
      newUsers: 0,
      activeEvents: 0,
      pendingNotifs: 0,
      recent: [] as AdminNotification[],
    };
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-brand-navy sm:text-3xl">
        סקירה כללית
      </h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="סה״כ משתמשים" value={stats.totalUsers} icon={Users} />
        <Stat label="נרשמו ב-24 שעות" value={stats.newUsers} icon={UserPlus} />
        <Stat label="אירועים פעילים" value={stats.activeEvents} icon={Calendar} />
        <Stat
          label="התראות שלא נקראו"
          value={stats.pendingNotifs}
          icon={Bell}
          href="/admin/notifications"
        />
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-navy">התראות אחרונות</h2>
          <Link
            href="/admin/notifications"
            className="text-sm font-bold text-brand-blue hover:underline"
          >
            הצג הכל
          </Link>
        </div>

        {stats.recent.length === 0 ? (
          <p className="mt-6 text-center text-slate-400">אין התראות עדיין.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {stats.recent.map((n) => (
              <li key={n.id} className="flex items-start gap-3 py-3">
                <span
                  className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${
                    n.read_at ? 'bg-slate-200' : 'bg-brand-blue'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-brand-navy">{n.title}</div>
                  {n.body && (
                    <div className="truncate text-sm text-slate-500">{n.body}</div>
                  )}
                </div>
                <time className="flex-shrink-0 text-xs text-slate-400">
                  {new Date(n.created_at).toLocaleString('he-IL')}
                </time>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  href,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  href?: string;
}) {
  const body = (
    <div className="rounded-lg border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300">
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5 text-gray-400" strokeWidth={2} />
        <span className="text-3xl font-extrabold text-brand-navy">{value}</span>
      </div>
      <div className="mt-2 text-sm font-medium text-gray-500">{label}</div>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}
