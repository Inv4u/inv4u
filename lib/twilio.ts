import twilio from 'twilio';

// Sends a WhatsApp notification to the business owner on every new lead,
// using the Twilio API. Requires the following environment variables:
//   TWILIO_ACCOUNT_SID        - Twilio account SID (sensitive)
//   TWILIO_AUTH_TOKEN         - Twilio auth token (sensitive)
//   TWILIO_WHATSAPP_FROM      - sender, e.g. "whatsapp:+14155238886" (sandbox)
//   NOTIFICATION_WHATSAPP_TO  - recipient, e.g. "whatsapp:+972506445570"
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;
const whatsappTo = process.env.NOTIFICATION_WHATSAPP_TO;

export interface Lead {
  name: string;
  phone: string;
  email: string;
  // The contact form does not currently collect a free-text message.
  // Optional here so callers can include one later without a code change.
  message?: string;
}

/**
 * Send a WhatsApp notification about a new lead.
 *
 * Best-effort by design: never throws. Any missing config or Twilio API
 * failure is logged and swallowed so the lead-capture flow (Supabase insert
 * + email) is never broken by WhatsApp delivery problems.
 */
export async function sendLeadNotification(lead: Lead): Promise<void> {
  if (!accountSid || !authToken || !whatsappFrom || !whatsappTo) {
    console.error(
      '[twilio] Skipping WhatsApp notification: missing one or more of ' +
        'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, NOTIFICATION_WHATSAPP_TO'
    );
    return;
  }

  try {
    const client = twilio(accountSid, authToken);
    await client.messages.create({
      from: whatsappFrom,
      to: whatsappTo,
      body: buildMessage(lead),
    });
  } catch (err) {
    console.error('[twilio] WhatsApp notification failed:', err);
    // Swallow: the lead is already saved and the email path is independent.
  }
}

function buildMessage(lead: Lead): string {
  const lines = [
    '🎉 ליד חדש מהאתר INV4U',
    '',
    `👤 שם: ${lead.name}`,
    `📞 טלפון: ${lead.phone}`,
    `✉️ אימייל: ${lead.email}`,
  ];
  if (lead.message) {
    lines.push(`💬 הודעה: ${lead.message}`);
  }
  return lines.join('\n');
}
