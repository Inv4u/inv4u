import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { sendLeadNotification as sendEmail } from '@/lib/email';
import { sendLeadNotification as sendWhatsApp } from '@/lib/twilio';
import { site } from '@/lib/site';

// nodemailer + twilio need the Node.js runtime.
export const runtime = 'nodejs';

/**
 * Admin-only debug endpoint. POST fires BOTH notification channels with a test
 * payload and returns a structured per-channel result, so Maor can verify
 * email/WhatsApp delivery independently of the signup flow. Awaits on purpose
 * (unlike signup) — the whole point is to report what happened.
 */
export async function POST() {
  // AuthZ: must be a logged-in admin.
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  if ((data as { role?: string } | null)?.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const testLead = {
    name: 'בדיקת התראות',
    phone: site.phoneDisplay,
    email: site.email,
    message: '🔔 בדיקת התראות מ-inv4u (admin test). אם קיבלתם — הכל עובד.',
  };

  // Email: throws on failure → catch into a result.
  const emailResult = await (async () => {
    try {
      await sendEmail(testLead);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
  })();

  // WhatsApp: returns a structured result (never throws).
  const whatsappResult = await sendWhatsApp(testLead);

  return NextResponse.json(
    { ok: emailResult.ok && whatsappResult.ok, email: emailResult, whatsapp: whatsappResult },
    { status: 200 }
  );
}
