'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, Check, MessageSquare, Phone } from 'lucide-react';
import type { FeatureKey } from '@/database.types';
import {
  FEATURE_CATALOG,
  lockedFeatureWhatsapp,
  whatsappTo,
  type FeatureMeta,
} from '@/lib/featureCatalog';
import { telHref } from '@/lib/site';

/**
 * The 6-card feature grid (3×2 desktop / 1-col mobile). Flat white cards with a
 * 1px border. Unlocked cards link to the feature page; locked cards open a modal
 * funnelling to WhatsApp / phone.
 */
export default function FeatureGrid({
  unlockedKeys,
}: {
  unlockedKeys: FeatureKey[];
}) {
  const unlocked = new Set(unlockedKeys);
  const [locked, setLocked] = useState<FeatureMeta | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURE_CATALOG.map((f) => {
          const isUnlocked = unlocked.has(f.key);
          const Icon = f.icon;
          return (
            <div
              key={f.key}
              className={`relative flex flex-col rounded-lg border border-gray-200 bg-white p-6 ${
                isUnlocked ? '' : 'cursor-pointer transition-colors hover:border-gray-300'
              }`}
              onClick={isUnlocked ? undefined : () => setLocked(f)}
            >
              {/* status badge, top-left in RTL */}
              <span className="absolute left-4 top-4">
                {isUnlocked ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                    פתוח
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                    <Lock className="h-3 w-3" strokeWidth={2.5} />
                    נעול
                  </span>
                )}
              </span>

              <Icon className="h-7 w-7 text-brand-navy" strokeWidth={1.75} />
              <h3 className="mt-4 font-semibold text-brand-navy">{f.name}</h3>
              <p className="mt-1 flex-1 text-sm text-gray-500">{f.description}</p>

              <div className="mt-5">
                {isUnlocked ? (
                  <Link
                    href={`/dashboard/${f.key}`}
                    className="block rounded-lg bg-brand-navy px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-[#0a1538]"
                  >
                    כניסה
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocked(f);
                    }}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:border-brand-navy hover:text-brand-navy"
                  >
                    פתיחה בשיחה
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {locked && <LockModal feature={locked} onClose={() => setLocked(null)} />}
    </>
  );
}

function LockModal({
  feature,
  onClose,
}: {
  feature: FeatureMeta;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-7 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Lock className="h-5 w-5 text-gray-500" strokeWidth={2} />
        </span>
        <h3 className="mt-4 text-lg font-semibold text-brand-navy">{feature.name}</h3>
        <p className="mt-2 text-gray-500">פיצ&apos;ר נעול. שיחה קצרה ונפתח.</p>

        <div className="mt-6 flex flex-col gap-2">
          <a
            href={whatsappTo(lockedFeatureWhatsapp(feature.name))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-navy px-4 py-2.5 font-semibold text-white transition-colors hover:bg-[#0a1538]"
          >
            <MessageSquare className="h-4 w-4" strokeWidth={2} />
            שיחה בוואטסאפ
          </a>
          <a
            href={telHref}
            dir="ltr"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 font-semibold text-brand-navy transition-colors hover:bg-gray-50"
          >
            <Phone className="h-4 w-4" strokeWidth={2} />
            050-644-5570
          </a>
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-sm font-medium text-gray-400 hover:text-gray-600"
        >
          סגירה
        </button>
      </div>
    </div>
  );
}
