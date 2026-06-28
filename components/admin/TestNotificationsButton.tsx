'use client';

import React, { useState } from 'react';

interface ChannelResult {
  ok: boolean;
  error?: string;
}

export default function TestNotificationsButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    email: ChannelResult;
    whatsapp: ChannelResult;
  } | null>(null);
  const [error, setError] = useState('');

  const run = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/admin/test-notifications', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'הבדיקה נכשלה');
      } else {
        setResult({ email: data.email, whatsapp: data.whatsapp });
      }
    } catch {
      setError('שגיאת רשת');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="rounded-lg bg-[#1A56DB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1542ad] disabled:opacity-50"
      >
        {loading ? 'שולח…' : 'שליחת התראות בדיקה'}
      </button>

      {error && (
        <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700">
          {error}
        </p>
      )}

      {result && (
        <ul className="mt-3 space-y-2 text-sm">
          <ResultRow label="אימייל" r={result.email} />
          <ResultRow label="וואטסאפ" r={result.whatsapp} />
        </ul>
      )}
    </div>
  );
}

function ResultRow({ label, r }: { label: string; r: ChannelResult }) {
  return (
    <li className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 px-4 py-2">
      <span className="font-semibold text-[#0D1B4B]">{label}</span>
      <span className={r.ok ? 'text-emerald-600' : 'text-rose-600'}>
        {r.ok ? 'נשלח בהצלחה' : r.error || 'נכשל'}
      </span>
    </li>
  );
}
