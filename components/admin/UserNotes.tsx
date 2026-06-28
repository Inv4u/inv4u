'use client';

import React, { useState, useTransition } from 'react';
import { saveUserNotes } from '@/app/admin/actions';

/** Free-text deal notes with save-on-blur (and an explicit save button). */
export default function UserNotes({
  userId,
  initialNotes,
}: {
  userId: string;
  initialNotes: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [saved, setSaved] = useState(initialNotes);
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [, startTransition] = useTransition();

  const save = () => {
    if (notes === saved) return;
    setStatus('saving');
    startTransition(async () => {
      const res = await saveUserNotes(userId, notes);
      if (res.ok) {
        setSaved(notes);
        setStatus('done');
      } else {
        setStatus('error');
      }
    });
  };

  return (
    <div>
      <textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setStatus('idle');
        }}
        onBlur={save}
        rows={4}
        placeholder="פרטי העסקה, סיכום שיחה, חבילה שנסגרה, מחיר…"
        className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm transition focus:border-brand-blue focus:outline-none"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {status === 'saving' && 'שומר…'}
          {status === 'done' && '✓ נשמר'}
          {status === 'error' && <span className="text-rose-600">השמירה נכשלה</span>}
        </span>
        <button
          type="button"
          onClick={save}
          disabled={notes === saved || status === 'saving'}
          className="rounded-full bg-brand-blue px-5 py-2 text-sm font-bold text-white transition hover:bg-[#1349c9] disabled:opacity-40"
        >
          שמירה
        </button>
      </div>
    </div>
  );
}
