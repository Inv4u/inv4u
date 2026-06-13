import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { sendLeadNotification as emailBusiness } from '@/lib/email';
import { sendLeadNotification as whatsappBusiness } from '@/lib/twilio';

/**
 * Server-only notification helpers for the auth flow.
 *
 * - Admin alerts (new signup) REUSE the existing lead notification integration
 *   (lib/email + lib/twilio), which already targets Maor's inbox / WhatsApp.
 * - User-directed messages (approval) use the SAME Gmail + Twilio credentials
 *   via fresh transports, since the existing helpers are hard-wired to Maor.
 *
 * Everything here is best-effort and never throws — auth must not break if a
 * notification fails.
 */

export interface SignupInfo {
  fullName: string;
  email?: string | null;
  phone?: string | null;
}

/** Alert Maor that a new user signed up and needs approval. */
export async function notifyAdminNewSignup(info: SignupInfo): Promise<void> {
  const lead = {
    name: info.fullName || 'משתמש חדש',
    phone: info.phone || '—',
    email: info.email || '—',
  };

  try {
    await emailBusiness(lead);
  } catch (err) {
    console.error('[notify] admin signup email failed:', err);
  }
  try {
    await whatsappBusiness({ ...lead, message: 'הרשמה חדשה — ממתינה לאישור ב-/admin' });
  } catch (err) {
    console.error('[notify] admin signup WhatsApp failed:', err);
  }
}

/** Tell a user their account was approved (email and/or WhatsApp). */
export async function notifyUserApproved(info: SignupInfo): Promise<void> {
  const name = info.fullName || '';

  if (info.email) {
    try {
      await sendApprovalEmail(info.email, name);
    } catch (err) {
      console.error('[notify] approval email failed:', err);
    }
  }
  if (info.phone) {
    try {
      await sendApprovalWhatsApp(info.phone, name);
    } catch (err) {
      console.error('[notify] approval WhatsApp failed:', err);
    }
  }
}

async function sendApprovalEmail(to: string, name: string): Promise<void> {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailAppPassword) return;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailAppPassword },
  });

  await transporter.sendMail({
    from: `"INV4U" <${gmailUser}>`,
    to,
    subject: 'החשבון שלך ב-INV4U אושר 🎉',
    text: `שלום ${name},\n\nהחשבון שלך אושר ואפשר להתחבר ולהתחיל. ברוכים הבאים ל-INV4U!`,
    html: `<div dir="rtl" style="font-family:Arial,sans-serif;color:#0D1B4B;">
      <h2 style="color:#1A56DB;">החשבון שלך אושר 🎉</h2>
      <p>שלום ${escapeHtml(name)},</p>
      <p>החשבון שלך ב-INV4U אושר. אפשר להתחבר ולהתחיל לנהל את האירוע שלך.</p>
    </div>`,
  });
}

async function sendApprovalWhatsApp(phone: string, name: string): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;
  if (!accountSid || !authToken || !whatsappFrom) return;

  const cleaned = phone.replace(/[\s\-()]/g, '');
  let e164 = cleaned;
  if (cleaned.startsWith('0')) e164 = `+972${cleaned.slice(1)}`;
  else if (cleaned.startsWith('972')) e164 = `+${cleaned}`;
  else if (!cleaned.startsWith('+')) e164 = `+${cleaned}`;

  const client = twilio(accountSid, authToken);
  await client.messages.create({
    from: whatsappFrom,
    to: `whatsapp:${e164}`,
    body: `שלום ${name}, החשבון שלך ב-INV4U אושר 🎉 אפשר להתחבר ולהתחיל.`,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
