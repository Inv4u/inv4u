'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createEventForUser } from '@/app/admin/actions';
import { EVENT_TYPE_LABELS } from '@/lib/eventLabels';
import type { EventType } from '@/database.types';

const EVENT_TYPES = Object.keys(EVENT_TYPE_LABELS) as EventType[];

export default function CreateEventInline({ userId }: { userId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    event_type: 'wedding' as EventType,
    event_date: '',
    venue_name: '',
    venue_address: '',
    couple_name_1: '',
    couple_name_2: '',
    honoree_name: '',
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const isCouple = form.event_type === 'wedding';

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      const res = await createEventForUser(userId, {
        event_type: form.event_type,
        event_date: form.event_date || null,
        venue_name: form.venue_name || null,
        venue_address: form.venue_address || null,
        couple_name_1: isCouple ? form.couple_name_1 || null : null,
        couple_name_2: isCouple ? form.couple_name_2 || null : null,
        honoree_name: !isCouple ? form.honoree_name || null : null,
      });
      if (!res.ok) {
        setError(res.error || 'יצירת האירוע נכשלה');
        return;
      }
      setOpen(false);
      setForm({
        event_type: 'wedding',
        event_date: '',
        venue_name: '',
        venue_address: '',
        couple_name_1: '',
        couple_name_2: '',
        honoree_name: '',
      });
      router.refresh();
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border-2 border-dashed border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:border-brand-blue hover:text-brand-blue"
      >
        + צור אירוע למשתמש
      </button>
    );
  }

  const input =
    'w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm transition focus:border-brand-blue focus:outline-none';

  return (
    <form
      onSubmit={submit}
      className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">
          סוג אירוע
          <select
            value={form.event_type}
            onChange={(e) => set('event_type', e.target.value)}
            className={`${input} mt-1 bg-white`}
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {EVENT_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-bold text-slate-700">
          תאריך
          <input
            type="date"
            value={form.event_date}
            onChange={(e) => set('event_date', e.target.value)}
            className={`${input} mt-1`}
          />
        </label>
      </div>

      {isCouple ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            placeholder="שם בן/בת זוג 1"
            value={form.couple_name_1}
            onChange={(e) => set('couple_name_1', e.target.value)}
            className={input}
          />
          <input
            placeholder="שם בן/בת זוג 2"
            value={form.couple_name_2}
            onChange={(e) => set('couple_name_2', e.target.value)}
            className={input}
          />
        </div>
      ) : (
        <input
          placeholder="שם בעל/בעלת האירוע"
          value={form.honoree_name}
          onChange={(e) => set('honoree_name', e.target.value)}
          className={input}
        />
      )}

      <input
        placeholder="שם האולם"
        value={form.venue_name}
        onChange={(e) => set('venue_name', e.target.value)}
        className={input}
      />
      <input
        placeholder="כתובת האולם"
        value={form.venue_address}
        onChange={(e) => set('venue_address', e.target.value)}
        className={input}
      />

      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand-blue px-5 py-2 text-sm font-bold text-white transition hover:bg-[#1349c9] disabled:opacity-50"
        >
          {pending ? 'יוצר…' : 'צור אירוע'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
        >
          ביטול
        </button>
      </div>
    </form>
  );
}
