import { after, NextRequest, NextResponse } from 'next/server';
import { notifyAdminNewSignup } from '@/lib/notify';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

// nodemailer + twilio need the Node.js runtime.
export const runtime = 'nodejs';

/**
 * Fired by the /signup page after a successful Supabase signup to alert Maor of
 * a new account. Returns 200 IMMEDIATELY and sends the email + WhatsApp in the
 * background via `after()` (runs post-response, so the client never waits on
 * Gmail/Twilio latency). Best-effort; never blocks signup. Rate-limited.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const limit = rateLimit(`notify-signup:${ip}`, 10, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ ok: true }, { status: 200 }); // swallow silently
  }

  let body: {
    userId?: unknown;
    fullName?: unknown;
    email?: unknown;
    phone?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const userId = typeof body.userId === 'string' ? body.userId : null;
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';

  // Run notifications AFTER the response is flushed — keeps signup fast and is
  // Vercel-safe (the function isn't frozen until `after` work settles).
  after(async () => {
    try {
      await notifyAdminNewSignup({ userId, fullName, email, phone });
    } catch (err) {
      console.error('[notify-signup] background notification error:', err);
    }
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
