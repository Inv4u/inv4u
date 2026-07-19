import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CircleCheck } from 'lucide-react';
import { getSupabaseServer } from '@/lib/supabase/server';
import SignOutButton from '@/components/SignOutButton';
import { getFeatureMeta } from '@/lib/featureCatalog';
import { FEATURE_KEYS, type FeatureKey } from '@/database.types';

// Per-feature page. Reachable only when the feature is unlocked for this user;
// otherwise we send them back to the dashboard. Content is a placeholder until
// each feature is built out.
export const dynamic = 'force-dynamic';

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ feature: string }>;
}) {
  const { feature } = await params;

  if (!FEATURE_KEYS.includes(feature as FeatureKey)) redirect('/dashboard');
  const key = feature as FeatureKey;
  const meta = getFeatureMeta(key);
  const Icon = meta?.icon;

  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data } = await supabase
    .from('feature_access')
    .select('unlocked')
    .eq('user_id', user.id)
    .eq('feature_key', key)
    .maybeSingle();
  const unlocked = (data as { unlocked?: boolean } | null)?.unlocked === true;
  if (!unlocked) redirect('/dashboard');

  return (
    <main className="min-h-screen bg-white" dir="rtl">
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-xl font-extrabold text-brand-navy">
            <span dir="ltr">Maor<span className="text-brand-blue">ly</span></span>
          </Link>
          <SignOutButton />
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        {Icon && (
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg border border-gray-200">
            <Icon className="h-7 w-7 text-brand-navy" strokeWidth={1.75} />
          </span>
        )}
        <h1 className="mt-6 text-2xl font-extrabold text-brand-navy">{meta?.name}</h1>
        <p className="mt-2 text-gray-500">{meta?.description}</p>
        <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">
          <CircleCheck className="h-4 w-4" strokeWidth={2} />
          הפיצ&apos;ר פתוח בחשבון שלכם
        </p>
        <p className="mt-6 text-gray-400">המסך המלא בבנייה.</p>

        <Link
          href="/dashboard"
          className="mt-8 inline-block text-sm font-semibold text-brand-blue hover:underline"
        >
          ← חזרה לדשבורד
        </Link>
      </div>
    </main>
  );
}
