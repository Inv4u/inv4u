import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase/server';
import SignOutButton from '@/components/SignOutButton';
import FeatureGrid from '@/components/dashboard/FeatureGrid';
import { whatsappTo, DASHBOARD_BANNER_WHATSAPP } from '@/lib/featureCatalog';
import { telHref } from '@/lib/site';
import {
  eventTitle,
  formatHebrewDate,
  EVENT_TYPE_LABELS,
} from '@/lib/eventLabels';
import type {
  User,
  FeatureAccess,
  FeatureKey,
  EventRow,
} from '@/database.types';

// Auth-gated (also enforced by middleware): any logged-in user. Every feature
// is locked until Maor unlocks it from /admin.
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Profile, feature access, and any event assigned to this user (RLS scopes
  // all three to the caller).
  const [{ data: profileData }, { data: featureData }, { data: eventData }] =
    await Promise.all([
      supabase.from('users').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('feature_access').select('*').eq('user_id', user.id),
      supabase
        .from('events')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1),
    ]);

  const profile = profileData as User | null;
  const features = (featureData as FeatureAccess[] | null) ?? [];
  const event = ((eventData as EventRow[] | null) ?? [])[0] ?? null;

  const firstName = profile?.full_name?.trim().split(/\s+/)[0] || 'אורח';
  const unlockedKeys: FeatureKey[] = features
    .filter((f) => f.unlocked)
    .map((f) => f.feature_key);

  return (
    <main className="min-h-screen bg-[#F4F5F7]" dir="rtl">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <span className="text-xl font-black text-brand-navy">
          INV<span className="text-brand-blue">4</span>U
        </span>
        <SignOutButton />
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* TOP BANNER — gold/navy gradient */}
        <section
          className="overflow-hidden rounded-3xl p-7 text-white shadow-xl sm:p-9"
          style={{
            background:
              'linear-gradient(120deg, #0D1B4B 0%, #1A2A6B 55%, #C9A86C 140%)',
          }}
        >
          <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black sm:text-3xl">
                מוכנים להתחיל? בואו נסגור את האירוע שלכם בשיחה קצרה
              </h2>
              <p className="mt-2 max-w-xl text-white/80">
                נתאם את חבילת האירוע שמתאימה לכם בדיוק, ונפתח את הפיצ&apos;רים בחשבון.
              </p>
            </div>
            <div className="flex w-full flex-shrink-0 flex-col gap-3 sm:flex-row md:w-auto md:flex-col lg:flex-row">
              <a
                href={whatsappTo(DASHBOARD_BANNER_WHATSAPP)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-emerald-500 px-6 py-3 text-center font-bold text-white shadow-lg transition hover:bg-emerald-600"
              >
                💬 דברו איתנו בוואטסאפ
              </a>
              <a
                href={telHref}
                dir="ltr"
                className="rounded-full bg-white px-6 py-3 text-center font-bold text-brand-navy shadow-lg transition hover:bg-slate-100"
              >
                📞 050-644-5570
              </a>
            </div>
          </div>
        </section>

        {/* WELCOME */}
        <section className="mt-8">
          <h1 className="text-2xl font-black text-brand-navy sm:text-3xl">
            שלום {firstName}, ברוכים הבאים ל-inv4u
          </h1>
          <p className="mt-2 max-w-2xl leading-relaxed text-slate-600">
            החשבון שלכם פתוח אבל הפיצ&apos;רים נעולים עד שנתאם איתכם את חבילת האירוע
            שלכם בשיחה קצרה.
          </p>
        </section>

        {/* EVENT STATUS — only when Maor has assigned an event */}
        {event && (
          <section className="mt-6 rounded-3xl border border-brand-blue/20 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wide text-brand-blue">
                  {EVENT_TYPE_LABELS[event.event_type]}
                </span>
                <h3 className="mt-1 text-xl font-black text-brand-navy">
                  {eventTitle(event)}
                </h3>
              </div>
              <div className="text-left text-sm text-slate-600">
                {event.event_date && (
                  <div className="font-bold text-slate-800">
                    📅 {formatHebrewDate(event.event_date)}
                  </div>
                )}
                {event.venue_name && (
                  <div className="mt-1">
                    📍 {event.venue_name}
                    {event.venue_address ? `, ${event.venue_address}` : ''}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* FEATURE GRID */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-black text-brand-navy">
            הפיצ&apos;רים שלכם
          </h2>
          <FeatureGrid unlockedKeys={unlockedKeys} />
        </section>

        {/* INFO CARD — always visible */}
        <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
          <h2 className="text-xl font-black text-brand-navy">
            איך להעלות רשימת מוזמנים
          </h2>
          <p className="mt-2 text-slate-600">
            לאחר שנסגור איתכם את חבילת האירוע, תוכלו להעלות רשימת מוזמנים בקלות:
          </p>

          <ol className="mt-5 space-y-4">
            <Step n={1} title="מכינים קובץ Excel / CSV">
              עם העמודות: שם מלא, טלפון, מספר אורחים, הערות
            </Step>
            <Step n={2} title="מעלים את הרשימה">
              לחיצה על העלאה, גרירה של הקובץ, או הוספה ידנית של אורחים
            </Step>
            <Step n={3} title="בודקים ומאשרים">
              עוברים על הרשימה, מתקנים אם צריך, ושולחים
            </Step>
          </ol>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-center">
            <p className="font-bold text-brand-navy">
              מוכנים? נשמח לשמוע מכם
            </p>
            <a
              href={whatsappTo(DASHBOARD_BANNER_WHATSAPP)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded-full bg-emerald-500 px-6 py-2.5 font-bold text-white transition hover:bg-emerald-600"
            >
              💬 דברו איתנו בוואטסאפ
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-black text-white">
        {n}
      </span>
      <div>
        <div className="font-bold text-brand-navy">{title}</div>
        <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{children}</p>
      </div>
    </li>
  );
}
