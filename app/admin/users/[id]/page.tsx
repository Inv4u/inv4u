import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import FeatureToggles from '@/components/admin/FeatureToggles';
import UserNotes from '@/components/admin/UserNotes';
import CreateEventInline from '@/components/admin/CreateEventInline';
import {
  eventTitle,
  formatHebrewDate,
  EVENT_TYPE_LABELS,
  EVENT_STATUS_LABELS,
} from '@/lib/eventLabels';
import { FEATURE_KEYS, type FeatureKey } from '@/database.types';
import type { User, FeatureAccess, EventRow } from '@/database.types';

export const dynamic = 'force-dynamic';

/** Convert an Israeli phone to E.164 digits (no +) for wa.me links. */
function toWaDigits(phone: string): string {
  const cleaned = phone.replace(/[\s\-()+]/g, '');
  if (cleaned.startsWith('972')) return cleaned;
  if (cleaned.startsWith('0')) return `972${cleaned.slice(1)}`;
  return cleaned;
}

export default async function AdminUserDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = getSupabaseAdmin();

  const [userRes, featRes, eventsRes] = await Promise.all([
    admin.from('users').select('*').eq('id', id).maybeSingle(),
    admin.from('feature_access').select('*').eq('user_id', id),
    admin
      .from('events')
      .select('*')
      .eq('owner_id', id)
      .order('created_at', { ascending: false }),
  ]);

  const user = userRes.data as User | null;
  if (!user) notFound();

  const feats = (featRes.data as FeatureAccess[] | null) ?? [];
  const events = (eventsRes.data as EventRow[] | null) ?? [];

  const initialFeatures = Object.fromEntries(
    FEATURE_KEYS.map((k) => [
      k,
      feats.find((f) => f.feature_key === k)?.unlocked === true,
    ])
  ) as Record<FeatureKey, boolean>;

  const waDigits = user.phone ? toWaDigits(user.phone) : null;

  return (
    <div>
      <Link
        href="/admin/users"
        className="text-sm font-bold text-brand-blue hover:underline"
      >
        ← כל המשתמשים
      </Link>

      {/* User info */}
      <div className="mt-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-brand-navy">
              {user.full_name || '(ללא שם)'}
              {user.role === 'admin' && (
                <span className="mr-2 rounded-full bg-brand-navy px-2 py-0.5 align-middle text-xs font-bold text-white">
                  אדמין
                </span>
              )}
            </h1>
            <dl className="mt-3 space-y-1 text-sm">
              <div dir="ltr" className="text-right text-slate-600">
                {user.email || '—'}
              </div>
              <div dir="ltr" className="text-right text-slate-600">
                {user.phone || '—'}
              </div>
              <div className="text-slate-400">
                נרשם {new Date(user.created_at).toLocaleString('he-IL')}
              </div>
            </dl>
          </div>

          {/* Quick actions */}
          <div className="flex flex-col gap-2">
            {waDigits && (
              <a
                href={`https://wa.me/${waDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-emerald-500 px-5 py-2 text-center text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                💬 שלח WhatsApp
              </a>
            )}
            {user.email && (
              <a
                href={`mailto:${user.email}`}
                className="rounded-full border-2 border-slate-200 px-5 py-2 text-center text-sm font-bold text-brand-blue transition hover:bg-slate-50"
              >
                ✉️ שלח אימייל
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="mt-6">
        <h2 className="mb-3 text-lg font-black text-brand-navy">
          פיצ&apos;רים — פתיחה / נעילה
        </h2>
        <FeatureToggles userId={user.id} initial={initialFeatures} />
      </section>

      {/* Deal notes */}
      <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-black text-brand-navy">הערות לעסקה</h2>
        <UserNotes userId={user.id} initialNotes={user.notes ?? ''} />
      </section>

      {/* Events */}
      <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-black text-brand-navy">אירועים</h2>
        {events.length === 0 ? (
          <p className="mb-4 text-sm text-slate-400">
            עדיין אין אירועים למשתמש זה.
          </p>
        ) : (
          <ul className="mb-4 space-y-2">
            {events.map((e) => (
              <li
                key={e.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-50 px-4 py-3"
              >
                <div>
                  <span className="text-xs font-bold uppercase text-brand-blue">
                    {EVENT_TYPE_LABELS[e.event_type]}
                  </span>
                  <div className="font-bold text-brand-navy">{eventTitle(e)}</div>
                </div>
                <div className="text-left text-xs text-slate-500">
                  <div>{formatHebrewDate(e.event_date) || 'ללא תאריך'}</div>
                  <div>{EVENT_STATUS_LABELS[e.status]}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <CreateEventInline userId={user.id} />
      </section>
    </div>
  );
}
