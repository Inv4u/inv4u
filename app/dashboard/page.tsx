import { redirect } from 'next/navigation';
import { MessageSquare, Phone, Calendar, MapPin } from 'lucide-react';
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

  const firstName = profile?.full_name?.trim().split(/\s+/)[0] || '';
  const unlockedKeys: FeatureKey[] = features
    .filter((f) => f.unlocked)
    .map((f) => f.feature_key);

  return (
    <main className="min-h-screen bg-white" dir="rtl">
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-xl font-extrabold text-brand-navy">
            INV<span className="text-brand-blue">4</span>U
          </span>
          <SignOutButton />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Welcome */}
        <h1 className="text-2xl font-extrabold text-brand-navy">
          שלום{firstName ? ` ${firstName}` : ''}
        </h1>

        {/* Banner — clean white card */}
        <div className="mt-6 rounded-lg border border-gray-200 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-brand-navy">
            החשבון פתוח. נסגור את החבילה בשיחה.
          </h2>
          <p className="mt-2 text-gray-500">
            הפיצ&apos;רים נפתחים לאחר שיחה קצרה להתאמת החבילה לאירוע שלכם.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappTo(DASHBOARD_BANNER_WHATSAPP)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-navy px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0a1538]"
            >
              <MessageSquare className="h-4 w-4" strokeWidth={2} />
              שיחה בוואטסאפ
            </a>
            <a
              href={telHref}
              dir="ltr"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-6 py-3 font-semibold text-brand-navy transition-colors hover:bg-gray-50"
            >
              <Phone className="h-4 w-4" strokeWidth={2} />
              050-644-5570
            </a>
          </div>
        </div>

        {/* Event status — when assigned */}
        {event && (
          <div className="mt-6 rounded-lg border border-gray-200 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-blue">
                  {EVENT_TYPE_LABELS[event.event_type]}
                </span>
                <h3 className="mt-1 text-lg font-semibold text-brand-navy">
                  {eventTitle(event)}
                </h3>
              </div>
              <div className="space-y-1 text-left text-sm text-gray-500">
                {event.event_date && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" strokeWidth={2} />
                    {formatHebrewDate(event.event_date)}
                  </div>
                )}
                {event.venue_name && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" strokeWidth={2} />
                    {event.venue_name}
                    {event.venue_address ? `, ${event.venue_address}` : ''}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Feature grid */}
        <h2 className="mb-4 mt-12 text-sm font-semibold uppercase tracking-wide text-gray-400">
          הפיצ&apos;רים שלכם
        </h2>
        <FeatureGrid unlockedKeys={unlockedKeys} />

        {/* Info — simple, at the bottom */}
        <div className="mt-10 rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-brand-navy">העלאת רשימת מוזמנים</h2>
          <p className="mt-1 text-sm text-gray-500">
            לאחר סגירת החבילה תוכלו להעלות רשימת מוזמנים מקובץ Excel או להוסיף ידנית.
          </p>
          <a
            href={whatsappTo(DASHBOARD_BANNER_WHATSAPP)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline"
          >
            <MessageSquare className="h-4 w-4" strokeWidth={2} />
            דברו איתנו
          </a>
        </div>
      </div>
    </main>
  );
}
