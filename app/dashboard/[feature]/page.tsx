import Link from 'next/link';
import { redirect } from 'next/navigation';
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

  // Unknown key → back to dashboard.
  if (!FEATURE_KEYS.includes(feature as FeatureKey)) redirect('/dashboard');
  const key = feature as FeatureKey;
  const meta = getFeatureMeta(key);

  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Gate: the feature must be unlocked for this user.
  const { data } = await supabase
    .from('feature_access')
    .select('unlocked')
    .eq('user_id', user.id)
    .eq('feature_key', key)
    .maybeSingle();
  const unlocked = (data as { unlocked?: boolean } | null)?.unlocked === true;
  if (!unlocked) redirect('/dashboard');

  return (
    <main className="min-h-screen bg-[#F4F5F7]" dir="rtl">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <Link href="/dashboard" className="text-xl font-black text-brand-navy">
          INV<span className="text-brand-blue">4</span>U
        </Link>
        <SignOutButton />
      </header>

      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-5xl shadow-sm">
          {meta?.icon ?? '✨'}
        </div>
        <h1 className="mt-6 text-3xl font-black text-brand-navy">{meta?.name}</h1>
        <p className="mt-3 text-lg text-slate-600">{meta?.description}</p>
        <p className="mt-6 inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-700">
          ✅ הפיצ&apos;ר פתוח בחשבון שלכם
        </p>
        <p className="mt-6 text-slate-500">המסך המלא של הפיצ&apos;ר בבנייה.</p>

        <Link
          href="/dashboard"
          className="mt-8 inline-block font-bold text-brand-blue hover:underline"
        >
          ← חזרה לדשבורד
        </Link>
      </div>
    </main>
  );
}
