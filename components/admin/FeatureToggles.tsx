'use client';

import React, { useState, useTransition } from 'react';
import { FEATURE_CATALOG } from '@/lib/featureCatalog';
import { toggleFeature } from '@/app/admin/actions';
import type { FeatureKey } from '@/database.types';

/**
 * 6 instant-save toggle switches. Clicking flips the feature optimistically and
 * persists via the toggleFeature server action; on error it reverts.
 */
export default function FeatureToggles({
  userId,
  initial,
}: {
  userId: string;
  initial: Record<FeatureKey, boolean>;
}) {
  const [state, setState] = useState<Record<FeatureKey, boolean>>(initial);
  const [busy, setBusy] = useState<FeatureKey | null>(null);
  const [error, setError] = useState('');
  const [, startTransition] = useTransition();

  const flip = (key: FeatureKey) => {
    const next = !state[key];
    setState((s) => ({ ...s, [key]: next }));
    setBusy(key);
    setError('');
    startTransition(async () => {
      const res = await toggleFeature(userId, key, next);
      setBusy(null);
      if (!res.ok) {
        setState((s) => ({ ...s, [key]: !next })); // revert
        setError(res.error || 'השמירה נכשלה');
      }
    });
  };

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm font-bold text-rose-600">
          {error}
        </p>
      )}
      {FEATURE_CATALOG.map((f) => {
        const on = state[f.key];
        return (
          <div
            key={f.key}
            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <div className="font-bold text-brand-navy">{f.name}</div>
                <div className="text-xs text-slate-500">
                  {on ? 'פתוח' : 'נעול'}
                </div>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={on}
              aria-label={f.name}
              disabled={busy === f.key}
              onClick={() => flip(f.key)}
              className={`relative h-7 w-12 flex-shrink-0 rounded-full transition disabled:opacity-50 ${
                on ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
                  on ? 'right-0.5' : 'right-[1.375rem]'
                }`}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
