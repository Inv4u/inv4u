'use client';

import React, { useState, useTransition } from 'react';
import type { Profile } from '@/database.types';
import { approveUser, revokeUser } from '@/app/admin/actions';

type Filter = 'pending' | 'approved' | 'all';

export default function AdminUserList({ users }: { users: Profile[] }) {
  const [filter, setFilter] = useState<Filter>('pending');
  const [selected, setSelected] = useState<Profile | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const counts = {
    pending: users.filter((u) => !u.approved).length,
    approved: users.filter((u) => u.approved).length,
    all: users.length,
  };

  const visible = users.filter((u) =>
    filter === 'pending' ? !u.approved : filter === 'approved' ? u.approved : true
  );

  const runAction = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setError('');
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error || 'הפעולה נכשלה');
    });
  };

  return (
    <div className="space-y-5">
      {/* filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(['pending', 'approved', 'all'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              filter === f
                ? 'bg-brand-blue text-white'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {f === 'pending' ? 'ממתינים' : f === 'approved' ? 'מאושרים' : 'הכל'}{' '}
            ({counts[f]})
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm font-bold text-rose-600">
          {error}
        </p>
      )}

      {visible.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-slate-400 ring-1 ring-slate-100">
          אין משתמשים בקטגוריה זו.
        </p>
      ) : (
        <ul className="space-y-3">
          {visible.map((u) => (
            <li
              key={u.id}
              className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between"
            >
              <button
                onClick={() => setSelected(u)}
                className="text-right"
                title="צפייה בפרטים"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brand-navy">
                    {u.full_name || '(ללא שם)'}
                  </span>
                  {u.role === 'admin' && (
                    <span className="rounded-full bg-brand-navy px-2 py-0.5 text-[10px] font-bold text-white">
                      אדמין
                    </span>
                  )}
                  {u.approved ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      מאושר
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                      ממתין
                    </span>
                  )}
                </div>
                <div dir="ltr" className="mt-0.5 text-right text-xs text-slate-500">
                  {u.email || u.phone || '—'}
                </div>
              </button>

              <div className="flex flex-shrink-0 gap-2">
                {u.approved ? (
                  <button
                    onClick={() => runAction(() => revokeUser(u.id))}
                    disabled={pending}
                    className="rounded-full border-2 border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                  >
                    ביטול אישור
                  </button>
                ) : (
                  <button
                    onClick={() => runAction(() => approveUser(u.id))}
                    disabled={pending}
                    className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {pending ? '…' : '✓ אישור'}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelected(null)}
          dir="rtl"
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-black text-brand-navy">
              {selected.full_name || '(ללא שם)'}
            </h3>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="אימייל" value={selected.email} ltr />
              <Row label="טלפון" value={selected.phone} ltr />
              <Row label="תפקיד" value={selected.role} />
              <Row
                label="סטטוס"
                value={selected.approved ? 'מאושר' : 'ממתין לאישור'}
              />
              <Row
                label="נרשם בתאריך"
                value={new Date(selected.created_at).toLocaleString('he-IL')}
              />
            </dl>
            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-full bg-slate-100 py-2.5 font-bold text-slate-600 hover:bg-slate-200"
            >
              סגירה
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  ltr,
}: {
  label: string;
  value: string | null;
  ltr?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="font-bold text-slate-500">{label}</dt>
      <dd dir={ltr ? 'ltr' : undefined} className="text-slate-800">
        {value || '—'}
      </dd>
    </div>
  );
}
