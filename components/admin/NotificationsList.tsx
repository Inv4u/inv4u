'use client';

import React, { useState, useTransition } from 'react';
import { markNotificationRead } from '@/app/admin/actions';
import type { AdminNotification } from '@/database.types';

const TYPE_LABELS: Record<AdminNotification['type'], string> = {
  new_signup: 'הרשמה חדשה',
  rsvp_received: 'אישור הגעה',
  lead_inquiry: 'פנייה',
  system_alert: 'התראת מערכת',
};

export default function NotificationsList({
  initial,
}: {
  initial: AdminNotification[];
}) {
  const [items, setItems] = useState(initial);
  const [, startTransition] = useTransition();

  const markRead = (id: string) => {
    setItems((list) =>
      list.map((n) =>
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n
      )
    );
    startTransition(async () => {
      await markNotificationRead(id);
    });
  };

  if (items.length === 0) {
    return (
      <p className="rounded-2xl bg-white p-8 text-center text-slate-400 ring-1 ring-slate-100">
        אין התראות.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((n) => (
        <li
          key={n.id}
          className={`flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-sm ${
            n.read_at ? 'border-slate-100' : 'border-brand-blue/30'
          }`}
        >
          <span
            className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${
              n.read_at ? 'bg-slate-200' : 'bg-brand-blue'
            }`}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                {TYPE_LABELS[n.type]}
              </span>
              <span className="font-bold text-brand-navy">{n.title}</span>
            </div>
            {n.body && (
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{n.body}</p>
            )}
            <time className="mt-1 block text-xs text-slate-400">
              {new Date(n.created_at).toLocaleString('he-IL')}
            </time>
          </div>
          {!n.read_at && (
            <button
              type="button"
              onClick={() => markRead(n.id)}
              className="flex-shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-500 transition hover:bg-slate-50"
            >
              סמן כנקרא
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
