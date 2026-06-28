'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/database.types';

export interface UserRowData {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  unlockedCount: number;
  eventCount: number;
}

type Filter = 'all' | 'new' | 'active' | 'paid';

const TOTAL_FEATURES = 6;

export default function UsersTable({ rows }: { rows: UserRowData[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');

  const counts = {
    all: rows.length,
    new: rows.filter((r) => r.unlockedCount === 0).length,
    active: rows.filter((r) => r.unlockedCount > 0 && r.unlockedCount < TOTAL_FEATURES).length,
    paid: rows.filter((r) => r.unlockedCount === TOTAL_FEATURES).length,
  };

  const visible = rows.filter((r) => {
    if (filter === 'new') return r.unlockedCount === 0;
    if (filter === 'active') return r.unlockedCount > 0 && r.unlockedCount < TOTAL_FEATURES;
    if (filter === 'paid') return r.unlockedCount === TOTAL_FEATURES;
    return true;
  });

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'הכל' },
    { key: 'new', label: 'חדשים' },
    { key: 'active', label: 'פעילים' },
    { key: 'paid', label: 'שילמו' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              filter === f.key
                ? 'bg-brand-blue text-white'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {f.label} ({counts[f.key]})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-slate-400 ring-1 ring-slate-100">
          אין משתמשים בקטגוריה זו.
        </p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 md:block">
            <table className="w-full text-right text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-bold">שם</th>
                  <th className="px-4 py-3 font-bold">אימייל</th>
                  <th className="px-4 py-3 font-bold">טלפון</th>
                  <th className="px-4 py-3 font-bold">נרשם</th>
                  <th className="px-4 py-3 font-bold">פיצ&apos;רים</th>
                  <th className="px-4 py-3 font-bold">אירועים</th>
                  <th className="px-4 py-3 font-bold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => router.push(`/admin/users/${r.id}`)}
                    className="cursor-pointer transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-bold text-brand-navy">
                      {r.full_name || '(ללא שם)'}
                      {r.role === 'admin' && (
                        <span className="mr-2 rounded-full bg-brand-navy px-2 py-0.5 text-[10px] font-bold text-white">
                          אדמין
                        </span>
                      )}
                    </td>
                    <td dir="ltr" className="px-4 py-3 text-right text-slate-600">
                      {r.email || '—'}
                    </td>
                    <td dir="ltr" className="px-4 py-3 text-right text-slate-600">
                      {r.phone || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(r.created_at).toLocaleDateString('he-IL')}
                    </td>
                    <td className="px-4 py-3">
                      <FeatureBadge count={r.unlockedCount} />
                    </td>
                    <td className="px-4 py-3 text-slate-600">{r.eventCount}</td>
                    <td className="px-4 py-3 text-brand-blue">←</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-3 md:hidden">
            {visible.map((r) => (
              <li
                key={r.id}
                onClick={() => router.push(`/admin/users/${r.id}`)}
                className="cursor-pointer rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-navy">
                    {r.full_name || '(ללא שם)'}
                  </span>
                  <FeatureBadge count={r.unlockedCount} />
                </div>
                <div dir="ltr" className="mt-1 text-right text-xs text-slate-500">
                  {r.email || r.phone || '—'}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  נרשם {new Date(r.created_at).toLocaleDateString('he-IL')} ·{' '}
                  {r.eventCount} אירועים
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function FeatureBadge({ count }: { count: number }) {
  const cls =
    count === 0
      ? 'bg-slate-100 text-slate-500'
      : count === TOTAL_FEATURES
        ? 'bg-emerald-100 text-emerald-700'
        : 'bg-amber-100 text-amber-700';
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}`}>
      {count}/{TOTAL_FEATURES}
    </span>
  );
}
