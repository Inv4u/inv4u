import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendLeadNotification } from '@/lib/email';
import { sendLeadNotification as sendWhatsAppNotification } from '@/lib/twilio';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import {
  isValidEmail,
  isValidName,
  isValidIsraeliPhone,
  NAME_MIN,
  NAME_MAX,
} from '@/lib/validation';

// nodemailer needs the Node.js runtime (not edge).
export const runtime = 'nodejs';

// Abuse brake: max 5 submissions per IP per hour.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  // 1. Rate limit by client IP before doing any work.
  const ip = getClientIp(request.headers);
  const limit = rateLimit(`leads:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'יותר מדי בקשות. נסו שוב מאוחר יותר.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfterSec) },
      }
    );
  }

  let body: {
    name?: unknown;
    phone?: unknown;
    email?: unknown;
    // Honeypot: a hidden field real users never fill. Bots auto-fill it.
    company?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // 2. Honeypot — if filled, silently accept (200) so bots don't learn they
  //    were caught, but never persist or notify.
  const honeypot = typeof body.company === 'string' ? body.company.trim() : '';
  if (honeypot) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';

  if (!name || !phone || !email) {
    return NextResponse.json(
      { error: 'Missing required fields: name, phone, email' },
      { status: 400 }
    );
  }
  if (!isValidName(name)) {
    return NextResponse.json(
      { error: `השם חייב להכיל בין ${NAME_MIN} ל-${NAME_MAX} תווים` },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: 'כתובת אימייל לא תקינה' },
      { status: 400 }
    );
  }
  if (!isValidIsraeliPhone(phone)) {
    return NextResponse.json(
      { error: 'מספר טלפון לא תקין (פורמט ישראלי: 05X-XXXXXXX)' },
      { status: 400 }
    );
  }

  // 3. Persist the lead (critical path).
  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert({ name, phone, email })
    .select()
    .single();

  if (error) {
    console.error('[leads] Supabase insert failed:', error);
    return NextResponse.json(
      { error: 'Failed to save your details. Please try again.' },
      { status: 500 }
    );
  }

  // 4. Notify the business (best-effort — the lead is already saved).
  try {
    await sendLeadNotification({ name, phone, email });
  } catch (err) {
    console.error('[leads] Email notification failed:', err);
    // Do not fail the request: the lead was captured successfully.
  }

  // 5. WhatsApp notification (best-effort, independent of the email above).
  //    sendWhatsAppNotification never throws, but we wrap defensively so a
  //    Twilio failure can never break lead capture.
  try {
    await sendWhatsAppNotification({ name, phone, email });
  } catch (err) {
    console.error('[leads] WhatsApp notification failed:', err);
    // Do not fail the request: the lead was captured successfully.
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
