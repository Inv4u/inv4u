import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase/server';
import SignOutButton from '@/components/SignOutButton';
import type { Profile } from '@/database.types';

// Auth-gated (also enforced by middleware): approved users only.
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  const profile = data as unknown as Profile | null;
  const name = profile?.full_name || 'אורח';

  return (
    <main className="min-h-screen bg-[#F4F5F7]" dir="rtl">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <span className="text-xl font-black text-brand-navy">
          INV<span className="text-brand-blue">4</span>U
        </span>
        <SignOutButton />
      </header>

      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/10 text-3xl">
          👋
        </div>
        <h1 className="mt-6 text-3xl font-black text-brand-navy md:text-4xl">
          ברוך הבא, {name}
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          הכלים לניהול האירוע שלך בדרך — features coming soon.
        </p>
      </div>
    </main>
  );
}
