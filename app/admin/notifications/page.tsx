import { getSupabaseAdmin } from '@/lib/supabase/admin';
import NotificationsList from '@/components/admin/NotificationsList';
import type { AdminNotification } from '@/database.types';

export const dynamic = 'force-dynamic';

export default async function AdminNotificationsPage() {
  let items: AdminNotification[] = [];
  try {
    const admin = getSupabaseAdmin();
    const { data } = await admin
      .from('admin_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    items = (data as AdminNotification[] | null) ?? [];
  } catch {
    items = [];
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-brand-navy sm:text-3xl">התראות</h1>
      <p className="mt-2 text-slate-600">הרשמות חדשות, אישורי הגעה ופניות.</p>
      <div className="mt-6">
        <NotificationsList initial={items} />
      </div>
    </div>
  );
}
