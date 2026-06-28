import nodemailer from 'nodemailer';

// Sends notification emails via Gmail SMTP using an App Password.
// Requires GMAIL_USER (the full Gmail address) and GMAIL_APP_PASSWORD
// (a 16-char App Password, NOT the account password) in the environment.
const gmailUser = process.env.GMAIL_USER;
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

// Where new-lead notifications are delivered. Defaults to the business inbox.
const NOTIFY_TO = process.env.LEAD_NOTIFY_TO || 'inv4u.business@gmail.com';

export interface Lead {
  name: string;
  phone: string;
  email: string;
}

export async function sendLeadNotification(lead: Lead): Promise<void> {
  if (!gmailUser || !gmailAppPassword) {
    const missing = [
      !gmailUser && 'GMAIL_USER',
      !gmailAppPassword && 'GMAIL_APP_PASSWORD',
    ]
      .filter(Boolean)
      .join(', ');
    console.error(`[email] notification failed: missing env: ${missing}`);
    throw new Error(`Missing ${missing} environment variable(s)`);
  }

  console.log(`[email] notification attempted with: ${NOTIFY_TO}`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  const subject = `ליד חדש מהאתר: ${lead.name}`;
  const text = [
    'התקבל ליד חדש מטופס יצירת הקשר באתר:',
    '',
    `שם: ${lead.name}`,
    `טלפון: ${lead.phone}`,
    `אימייל: ${lead.email}`,
  ].join('\n');

  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; font-size: 16px; color: #0D1B4B;">
      <h2 style="color:#1A56DB;">ליד חדש מהאתר 🎉</h2>
      <p>התקבל ליד חדש מטופס יצירת הקשר:</p>
      <table style="border-collapse: collapse;">
        <tr><td style="padding:4px 12px;"><strong>שם</strong></td><td style="padding:4px 12px;">${escapeHtml(
          lead.name
        )}</td></tr>
        <tr><td style="padding:4px 12px;"><strong>טלפון</strong></td><td style="padding:4px 12px;">${escapeHtml(
          lead.phone
        )}</td></tr>
        <tr><td style="padding:4px 12px;"><strong>אימייל</strong></td><td style="padding:4px 12px;">${escapeHtml(
          lead.email
        )}</td></tr>
      </table>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Inv4u Leads" <${gmailUser}>`,
      to: NOTIFY_TO,
      replyTo: lead.email,
      subject,
      text,
      html,
    });
    console.log('[email] notification success');
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error(`[email] notification failed: ${error}`);
    throw err;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
