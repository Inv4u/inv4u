import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';
import SignOutButton from '@/components/SignOutButton';

// Admin-only shell (also enforced by middleware). Verifies role once here.
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  if ((data as { role?: string } | null)?.role !== 'admin') redirect('/dashboard');

  return (
    <div className="min-h-screen bg-[#F4F5F7] md:flex" dir="rtl">
      <AdminSidebar />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 md:hidden">
          <span className="font-black text-brand-navy">
            <span dir="ltr">Maor<span className="text-brand-blue">ly</span></span> · ניהול
          </span>
          <SignOutButton className="rounded-full border border-slate-300 px-3 py-1 text-xs font-bold text-slate-600" />
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
