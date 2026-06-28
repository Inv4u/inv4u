import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import SignOutButton from '@/components/SignOutButton';
import type { User } from '@/database.types';

// Admin-only (also enforced by middleware).
// NOTE: interim shell — the full admin dashboard is built in Task 5.
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: me } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  if ((me as { role?: string } | null)?.role !== 'admin') redirect('/dashboard');

  let users: User[] = [];
  try {
    const admin = getSupabaseAdmin();
    const { data } = await admin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    users = (data as User[] | null) ?? [];
  } catch {
    users = [];
  }

  return (
    <main className="min-h-screen bg-[#F4F5F7]" dir="rtl">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-brand-navy">
            INV<span className="text-brand-blue">4</span>U
          </span>
          <span className="rounded-full bg-brand-navy px-3 py-1 text-xs font-bold text-white">
            ניהול
          </span>
        </div>
        <SignOutButton />
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-black text-brand-navy">ניהול</h1>
        <p className="mt-2 text-slate-600">{users.length} משתמשים רשומים.</p>
      </div>
    </main>
  );
}
