import { NextRequest, NextResponse } from 'next/server';
import { notifyAdminNewSignup } from '@/lib/notify';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

// nodemailer + twilio need the Node.js runtime.
export const runtime = 'nodejs';

/**
 * Fired by the /signup page after a successful Supabase signup to alert Maor
 * that a new account is pending approval. Best-effort; reuses the existing
 * lead-notification integration. Rate-limited to blunt abuse.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const limit = rateLimit(`notify-signup:${ip}`, 10, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ ok: true }, { status: 200 }); // swallow silently
  }

  let body: { fullName?: unknown; email?: unknown; phone?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';

  await notifyAdminNewSignup({ fullName, email, phone });
  return NextResponse.json({ ok: true }, { status: 200 });
}
