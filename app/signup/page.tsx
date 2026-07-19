'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth';
import { isValidEmail, isValidIsraeliPhone } from '@/lib/validation';
import { AuthShell, Field, translateAuthError } from '@/components/AuthShell';
import Turnstile from '@/components/Turnstile';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState(''); // honeypot — real users never fill it
  const [tsToken, setTsToken] = useState(''); // Cloudflare Turnstile token
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const name = fullName.trim();
    const id = identifier.trim();
    const isEmail = id.includes('@');

    if (name.length < 2) {
      setError('נא להזין שם מלא (לפחות 2 תווים)');
      return;
    }
    if (!id) {
      setError('נא להזין אימייל או מספר טלפון');
      return;
    }
    if (isEmail && !isValidEmail(id)) {
      setError('כתובת האימייל אינה תקינה');
      return;
    }
    if (!isEmail && !isValidIsraeliPhone(id)) {
      setError('מספר הטלפון אינו תקין (לדוגמה: 050-1234567)');
      return;
    }
    if (password.length < 8) {
      setError('הסיסמה חייבת להכיל לפחות 8 תווים');
      return;
    }

    setSubmitting(true);
    const startedAt = performance.now();

    // Server-side security gate: rate limit + honeypot + Turnstile verification.
    // Must pass before we create the account. (Skips Turnstile if keys unset.)
    try {
      const gate = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          email: isEmail ? id : '',
          phone: isEmail ? '' : id,
          company, // honeypot
          turnstileToken: tsToken,
        }),
      });
      const gateData = (await gate.json().catch(() => ({ ok: false }))) as {
        ok?: boolean;
        error?: string;
      };
      if (!gate.ok || !gateData.ok) {
        setError(gateData.error || 'אירעה שגיאה. נסו שוב.');
        setSubmitting(false);
        return;
      }
    } catch {
      setError('שגיאת רשת. בדקו את החיבור ונסו שוב.');
      setSubmitting(false);
      return;
    }

    const result = await signUp({
      email: isEmail ? id : undefined,
      phone: isEmail ? undefined : id,
      password,
      full_name: name,
    });
    if (!result.ok) {
      setError(translateAuthError(result.error));
      setSubmitting(false);
      return;
    }
    console.log(`[signup] client blocking path ${Math.round(performance.now() - startedAt)}ms`);

    // Alert Maor — fire-and-forget so the redirect isn't blocked by Gmail/Twilio
    // latency. `keepalive` lets the request survive the navigation; the route
    // itself returns instantly and sends the email/WhatsApp in the background.
    // The 6 locked features are seeded automatically by the DB signup trigger.
    try {
      void fetch('/api/auth/notify-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: result.userId,
          fullName: name,
          email: isEmail ? id : '',
          phone: isEmail ? '' : id,
        }),
        keepalive: true,
      });
    } catch {
      /* best-effort */
    }

    router.push('/dashboard');
  };

  return (
    <AuthShell
      title="הרשמה ל-Maorly"
      subtitle="צרו חשבון בחינם — ונסגור את חבילת האירוע בשיחה קצרה"
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Field
          id="fullName"
          label="שם מלא"
          value={fullName}
          onChange={setFullName}
          placeholder="ישראל ישראלי"
          autoComplete="name"
        />
        <Field
          id="identifier"
          label="אימייל או טלפון"
          value={identifier}
          onChange={setIdentifier}
          placeholder="name@email.com או 050-1234567"
          autoComplete="username"
        />
        <Field
          id="password"
          label="סיסמה"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="לפחות 8 תווים"
          autoComplete="new-password"
        />

        {/* Honeypot — hidden from humans; bots auto-fill it. */}
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden opacity-0"
        >
          <label htmlFor="company">Company (leave empty)</label>
          <input
            type="text"
            id="company"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Invisible CAPTCHA — renders nothing unless a challenge is needed, and
            nothing at all when the site key is unset. */}
        <Turnstile onVerify={setTsToken} />

        {error && (
          <p className="rounded-lg bg-rose-50 px-4 py-2 text-center text-sm font-bold text-rose-600">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'יוצרים חשבון…' : 'הרשמה'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        כבר יש לכם חשבון?{' '}
        <Link href="/login" className="font-bold text-brand-blue hover:underline">
          התחברו
        </Link>
      </p>
    </AuthShell>
  );
}
