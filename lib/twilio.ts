import twilio from 'twilio';

// Sends a WhatsApp notification to the business owner on every new lead/signup,
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

export interface NotifyResult {
  ok: boolean;
  error?: string;
  recipient?: string;
}

/**
 * Ensure a WhatsApp address carries the `whatsapp:` channel prefix Twilio
 * requires. Twilio fails silently-ish (throws "Channel not found"-type errors)
 * if `from`/`to` are bare E.164 numbers — a very common misconfiguration. We
 * normalise here so it works whether the env var has the prefix or not.
 */
function asWhatsApp(value: string): string {
  const v = value.trim();
  return v.startsWith('whatsapp:') ? v : `whatsapp:${v}`;
}

/**
 * Send a WhatsApp notification about a new lead/signup.
 *
 * Best-effort by design: never throws (so it can't break lead capture / signup).
 * Returns a structured result and logs every attempt so failures are visible in
 * Vercel logs and to the /api/admin/test-notifications endpoint.
 */
export async function sendLeadNotification(lead: Lead): Promise<NotifyResult> {
  if (!accountSid || !authToken || !whatsappFrom || !whatsappTo) {
    const missing = [
      !accountSid && 'TWILIO_ACCOUNT_SID',
      !authToken && 'TWILIO_AUTH_TOKEN',
      !whatsappFrom && 'TWILIO_WHATSAPP_FROM',
      !whatsappTo && 'NOTIFICATION_WHATSAPP_TO',
    ]
      .filter(Boolean)
      .join(', ');
    const error = `missing env: ${missing}`;
    console.error(`[twilio] WhatsApp notification failed: ${error}`);
    return { ok: false, error };
  }

  const to = asWhatsApp(whatsappTo);
  const from = asWhatsApp(whatsappFrom);
  console.log(`[twilio] WhatsApp notification attempted with: ${to}`);

  try {
    const client = twilio(accountSid, authToken);
    const msg = await client.messages.create({
      from,
      to,
      body: buildMessage(lead),
    });
    console.log(`[twilio] WhatsApp notification success (sid: ${msg.sid})`);
    return { ok: true, recipient: to };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error(`[twilio] WhatsApp notification failed: ${error}`);
    return { ok: false, error, recipient: to };
  }
}

function buildMessage(lead: Lead): string {
  if (lead.message) {
    // A purpose-built message (e.g. signup alert) — send it verbatim.
    return lead.message;
  }
  return [
    '🎉 ליד חדש מהאתר INV4U',
    '',
    `👤 שם: ${lead.name}`,
    `📞 טלפון: ${lead.phone}`,
    `✉️ אימייל: ${lead.email}`,
  ].join('\n');
}
