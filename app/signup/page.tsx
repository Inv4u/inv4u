'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth';
import { AuthShell, Field, translateAuthError } from '@/components/AuthShell';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (fullName.trim().length < 2) {
      setError('נא להזין שם מלא (לפחות 2 תווים)');
      return;
    }
    if (!identifier.trim()) {
      setError('נא להזין אימייל או מספר טלפון');
      return;
    }
    if (password.length < 8) {
      setError('הסיסמה חייבת להכיל לפחות 8 תווים');
      return;
    }

    const isEmail = identifier.includes('@');
    setSubmitting(true);
    const result = await signUp({
      email: isEmail ? identifier : undefined,
      phone: isEmail ? undefined : identifier,
      password,
      full_name: fullName,
    });
    if (!result.ok) {
      setError(translateAuthError(result.error));
      setSubmitting(false);
      return;
    }

    // Alert Maor (best-effort — never blocks the signup). The 6 locked features
    // are seeded by the DB signup trigger.
    try {
      await fetch('/api/auth/notify-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: result.userId,
          fullName,
          email: isEmail ? identifier : '',
          phone: isEmail ? '' : identifier,
        }),
      });
    } catch {
      /* ignore */
    }

    router.push('/dashboard');
  };

  return (
    <AuthShell title="הרשמה ל-INV4U" subtitle="צרו חשבון — נאשר אתכם ונצא לדרך">
      <form onSubmit={handleSubmit} className="space-y-5">
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
          placeholder="name@email.com או 050-0000000"
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
