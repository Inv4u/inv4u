import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendLeadNotification } from '@/lib/email';
import { sendLeadNotification as sendWhatsAppNotification } from '@/lib/twilio';

// nodemailer needs the Node.js runtime (not edge).
export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: { name?: unknown; phone?: unknown; email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
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
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: 'Invalid email address' },
      { status: 400 }
    );
  }

  // 1. Persist the lead (critical path).
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

  // 2. Notify the business (best-effort — the lead is already saved).
  try {
    await sendLeadNotification({ name, phone, email });
  } catch (err) {
    console.error('[leads] Email notification failed:', err);
    // Do not fail the request: the lead was captured successfully.
  }

  // 3. WhatsApp notification (best-effort, independent of the email above).
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
