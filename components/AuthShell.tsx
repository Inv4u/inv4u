'use client';

import React from 'react';
import Link from 'next/link';

/** Centered card layout shared by the signup + login pages. Plain white. */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-16" dir="rtl">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="block text-center text-2xl font-extrabold text-brand-navy"
        >
          INV<span className="text-brand-blue">4</span>U
        </Link>
        <h1 className="mt-8 text-center text-2xl font-extrabold text-brand-navy">
          {title}
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}

export function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-brand-navy">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-brand-navy transition-colors placeholder:text-gray-400 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
      />
    </div>
  );
}

/** Maps common Supabase auth errors to friendly Hebrew. */
export function translateAuthError(msg?: string): string {
  if (!msg) return 'אירעה שגיאה. נסו שוב.';
  const m = msg.toLowerCase();
  if (m.includes('already registered') || m.includes('already exists'))
    return 'המשתמש כבר רשום. נסו להתחבר.';
  if (m.includes('invalid login') || m.includes('invalid credentials'))
    return 'אימייל/טלפון או סיסמה שגויים.';
  if (m.includes('password')) return 'הסיסמה אינה תקינה (לפחות 8 תווים).';
  if (m.includes('email')) return 'כתובת האימייל אינה תקינה.';
  if (m.includes('phone')) return 'מספר הטלפון אינו תקין.';
  return 'אירעה שגיאה. נסו שוב.';
}
