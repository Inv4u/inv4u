import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { isValidEmail, isValidIsraeliPhone, isValidName } from '@/lib/validation';

// fetch to Cloudflare + consistent Node behaviour.
export const runtime = 'nodejs';

// Abuse brake: max 10 signup attempts per IP per hour.
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Server-side SIGNUP GATE. The /signup form must pass this before it creates the
 * Supabase account (account creation itself stays client-side to preserve the
 * proven session flow — see BUILD_LOG Session 7). This route enforces, in order:
 *   1. IP rate limiting
 *   2. honeypot
 *   3. server-side input validation
 *   4. Cloudflare Turnstile verification (skipped gracefully if env unset)
 * It creates nothing and touches no secrets beyond TURNSTILE_SECRET_KEY.
 */
export async function POST(request: NextRequest) {
  const startedAt = Date.now();

  // 1. Rate limit by client IP.
  const ip = getClientIp(request.headers);
  const limit = rateLimit(`signup:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
  if (!limit.allowed) {
    console.log(`[signup] gate blocked (rate limit) ip=${ip} ${Date.now() - startedAt}ms`);
    return NextResponse.json(
      { ok: false, error: 'יותר מדי בקשות. נסו שוב מאוחר יותר.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
    );
  }

  let body: {
    fullName?: unknown;
    email?: unknown;
    phone?: unknown;
    company?: unknown; // honeypot
    turnstileToken?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  // 2. Honeypot — real users never fill `company`. Block silently (generic error;
  //    the client stops and never creates an account).
  const honeypot = typeof body.company === 'string' ? body.company.trim() : '';
  if (honeypot) {
    console.log(`[signup] gate blocked (honeypot) ip=${ip} ${Date.now() - startedAt}ms`);
    return NextResponse.json({ ok: false, error: 'אירעה שגיאה. נסו שוב.' }, { status: 200 });
  }

  // 3. Server-side validation (never trust the browser).
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';

  if (!isValidName(fullName)) {
    return NextResponse.json({ ok: false, error: 'נא להזין שם מלא' }, { status: 400 });
  }
  if (!email && !phone) {
    return NextResponse.json({ ok: false, error: 'נא להזין אימייל או טלפון' }, { status: 400 });
  }
  if (email && !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'כתובת אימייל לא תקינה' }, { status: 400 });
  }
  if (phone && !isValidIsraeliPhone(phone)) {
    return NextResponse.json({ ok: false, error: 'מספר טלפון לא תקין' }, { status: 400 });
  }

  // 4. Cloudflare Turnstile — verify server-side. Skips gracefully if unset so
  //    local dev / current prod keep working until Maor adds the keys.
  const secret = process.env.TURNSTILE_SECRET_KEY;
  let turnstileMode = 'skipped';
  if (secret) {
    turnstileMode = 'verified';
    const token = typeof body.turnstileToken === 'string' ? body.turnstileToken : '';
    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'אימות אנושי נדרש. רעננו את הדף ונסו שוב.' },
        { status: 400 }
      );
    }
    try {
      const form = new URLSearchParams();
      form.append('secret', secret);
      form.append('response', token);
      if (ip !== 'unknown') form.append('remoteip', ip);

      const res = await fetch(TURNSTILE_VERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form,
      });
      const outcome = (await res.json()) as { success?: boolean };
      if (!outcome.success) {
        console.log(`[signup] gate blocked (turnstile) ip=${ip} ${Date.now() - startedAt}ms`);
        return NextResponse.json(
          { ok: false, error: 'אימות אנושי נכשל. נסו שוב.' },
          { status: 400 }
        );
      }
    } catch (err) {
      // Cloudflare unreachable — fail closed so the CAPTCHA can't be skipped by
      // knocking out the verifier.
      console.error('[signup] turnstile verify error:', err);
      return NextResponse.json(
        { ok: false, error: 'שגיאת אימות זמנית. נסו שוב בעוד רגע.' },
        { status: 503 }
      );
    }
  }

  console.log(`[signup] gate passed ip=${ip} turnstile=${turnstileMode} ${Date.now() - startedAt}ms`);
  return NextResponse.json({ ok: true }, { status: 200 });
}
