import { sendLeadNotification as emailBusiness } from '@/lib/email';
import { sendLeadNotification as whatsappBusiness } from '@/lib/twilio';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

/**
 * Server-only notification helpers for the signup flow.
 *
 * On a new signup we (best-effort, never throwing — auth must not break):
 *   1. record an in-app `admin_notifications` row (Maor sees it in /admin), and
 *   2. alert Maor by email + WhatsApp, REUSING the existing lead-notification
 *      integration (lib/email + lib/twilio), which already targets his inbox /
 *      WhatsApp (inv4u.business@gmail.com / whatsapp:+972506445570).
 */

export interface SignupInfo {
  userId?: string | null;
  fullName: string;
  email?: string | null;
  phone?: string | null;
}

/** The Hebrew alert copy Maor receives for a new signup. */
function signupMessage(info: SignupInfo): string {
  const who = info.email || info.phone || '—';
  const name = info.fullName || 'משתמש חדש';
  return `משתמש חדש נרשם: ${name} | ${who} | קבעו שיחה לסגירת חבילה`;
}

/** Alert Maor that a new user signed up (in-app row + email + WhatsApp). */
export async function notifyAdminNewSignup(info: SignupInfo): Promise<void> {
  const name = info.fullName || 'משתמש חדש';
  const message = signupMessage(info);
  const lead = {
    name,
    phone: info.phone || '—',
    email: info.email || '—',
  };

  // Run all three channels concurrently and independently — one failing must
  // not block the others. Each helper logs its own success/failure (Task 2).
  await Promise.allSettled([
    // 1. In-app notification row (service-role insert; bypasses RLS).
    (async () => {
      try {
        const admin = getSupabaseAdmin();
        await admin.from('admin_notifications').insert({
          type: 'new_signup',
          title: `משתמש חדש נרשם: ${name}`,
          body: message,
          related_user_id: info.userId ?? null,
        });
        console.log('[notify] admin_notifications row inserted');
      } catch (err) {
        console.error('[notify] admin_notifications insert failed:', errMessage(err));
      }
    })(),
    // 2. Email Maor (reuses the lead-notification Gmail transport).
    emailBusiness(lead),
    // 3. WhatsApp Maor (reuses the lead-notification Twilio sender; carries the
    //    exact signup copy).
    whatsappBusiness({ ...lead, message }),
  ]);
}

function errMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
