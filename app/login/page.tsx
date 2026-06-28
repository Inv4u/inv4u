'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, getCurrentUser } from '@/lib/auth';
import { AuthShell, Field, translateAuthError } from '@/components/AuthShell';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('נא להזין אימייל/טלפון וסיסמה');
      return;
    }

    setSubmitting(true);
    const result = await signIn({ email_or_phone: identifier, password });
    if (!result.ok) {
      setError(translateAuthError(result.error));
      setSubmitting(false);
      return;
    }

    // Route by role: admins → /admin, everyone else → dashboard (features are
    // gated inside the dashboard, so there is no approval wait).
    const user = await getCurrentUser();
    if (user?.role === 'admin') {
      router.push('/admin');
    } else {
      const next = params.get('next');
      router.push(next && next.startsWith('/') ? next : '/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        placeholder="הסיסמה שלכם"
        autoComplete="current-password"
      />

      <div className="text-left">
        <Link
          href="/forgot-password"
          className="text-sm font-bold text-brand-blue hover:underline"
        >
          שכחתי סיסמה
        </Link>
      </div>

      {error && (
        <p className="rounded-lg bg-rose-50 px-4 py-2 text-center text-sm font-bold text-rose-600">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? 'מתחברים…' : 'התחברות'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthShell title="התחברות" subtitle="שמחים לראות אתכם שוב">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
      <p className="mt-6 text-center text-sm text-slate-500">
        אין לכם חשבון?{' '}
        <Link href="/signup" className="font-bold text-brand-blue hover:underline">
          הרשמה
        </Link>
      </p>
    </AuthShell>
  );
}
