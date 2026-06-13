'use client';

import React from 'react';
import Link from 'next/link';

/** Centered card layout shared by the signup + login pages. */
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
    <main className="flex min-h-screen items-center justify-center bg-mesh px-4 py-16" dir="rtl">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl md:p-10">
        <Link href="/" className="block text-center text-2xl font-black text-brand-navy">
          INV<span className="text-brand-blue">4</span>U
        </Link>
        <h1 className="mt-6 text-center text-3xl font-black text-brand-navy">{title}</h1>
        <p className="mt-2 text-center text-slate-500">{subtitle}</p>
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
      <label htmlFor={id} className="mb-2 block font-bold text-slate-800">
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
        className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-medium transition focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
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
