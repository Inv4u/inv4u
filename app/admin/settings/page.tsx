import { getSupabaseServer } from '@/lib/supabase/server';
import { site } from '@/lib/site';
import type { User } from '@/database.types';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let me: User | null = null;
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    me = data as User | null;
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-brand-navy sm:text-3xl">הגדרות</h1>

      <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-black text-brand-navy">החשבון שלי</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <Row label="שם" value={me?.full_name || '—'} />
          <Row label="אימייל" value={me?.email || '—'} ltr />
          <Row label="טלפון" value={me?.phone || '—'} ltr />
          <Row label="תפקיד" value={me?.role === 'admin' ? 'מנהל' : 'בעל אירוע'} />
        </dl>
      </section>

      <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-black text-brand-navy">פרטי העסק</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <Row label="אימייל עסקי" value={site.email} ltr />
          <Row label="טלפון" value={site.phoneDisplay} ltr />
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-slate-500">
          פתיחת פיצ&apos;רים למשתמשים מתבצעת פר-משתמש מתוך{' '}
          <span className="font-bold text-slate-700">משתמשים → כרטיס משתמש</span>.
          כל פתיחה נרשמת עם השם והתאריך שלכם.
        </p>
      </section>
    </div>
  );
}

function Row({
  label,
  value,
  ltr,
}: {
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="font-bold text-slate-500">{label}</dt>
      <dd dir={ltr ? 'ltr' : undefined} className="text-slate-800">
        {value}
      </dd>
    </div>
  );
}
