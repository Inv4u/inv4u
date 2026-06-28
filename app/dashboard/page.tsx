import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase/server';
import SignOutButton from '@/components/SignOutButton';
import type { User } from '@/database.types';

// Auth-gated (also enforced by middleware): any logged-in user.
// NOTE: interim shell — the full locked dashboard is built in Task 4.
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  const profile = data as User | null;
  const name = profile?.full_name?.split(' ')[0] || 'אורח';

  return (
    <main className="min-h-screen bg-[#F4F5F7]" dir="rtl">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <span className="text-xl font-black text-brand-navy">
          INV<span className="text-brand-blue">4</span>U
        </span>
        <SignOutButton />
      </header>

      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-3xl font-black text-brand-navy md:text-4xl">
          שלום {name}, ברוכים הבאים ל-inv4u
        </h1>
        <p className="mt-3 text-lg text-slate-600">הדשבורד בדרך…</p>
      </div>
    </main>
  );
}
