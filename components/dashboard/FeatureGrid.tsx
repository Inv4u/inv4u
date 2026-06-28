'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { FeatureKey } from '@/database.types';
import {
  FEATURE_CATALOG,
  lockedFeatureWhatsapp,
  whatsappTo,
  type FeatureMeta,
} from '@/lib/featureCatalog';
import { telHref } from '@/lib/site';

/**
 * The 6-card feature grid (3×2 desktop / 1-col mobile). Unlocked cards link to
 * the feature page; locked cards open a modal funnelling to WhatsApp / phone.
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURE_CATALOG.map((f) => {
          const isUnlocked = unlocked.has(f.key);
          return (
            <div
              key={f.key}
              className={`flex flex-col rounded-3xl border bg-white p-6 shadow-sm transition ${
                isUnlocked
                  ? 'border-emerald-200'
                  : 'cursor-pointer border-slate-100 hover:-translate-y-1 hover:shadow-lg'
              }`}
              onClick={isUnlocked ? undefined : () => setLocked(f)}
            >
              <div className="flex items-start justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-3xl">
                  {f.icon}
                </span>
                <span
                  className="text-2xl"
                  title={isUnlocked ? 'פתוח' : 'נעול'}
                  aria-label={isUnlocked ? 'פתוח' : 'נעול'}
                >
                  {isUnlocked ? '✅' : '🔒'}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-black text-brand-navy">{f.name}</h3>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600">
                {f.description}
              </p>

              <div className="mt-5">
                {isUnlocked ? (
                  <Link
                    href={`/dashboard/${f.key}`}
                    className="block rounded-full bg-brand-blue px-5 py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#1349c9]"
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
                    className="w-full rounded-full border-2 border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:border-brand-blue hover:text-brand-blue"
                  >
                    פנו אלינו לפתיחה
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {locked && (
        <LockModal feature={locked} onClose={() => setLocked(null)} />
      )}
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
          🔒
        </div>
        <h3 className="mt-5 text-xl font-black text-brand-navy">{feature.name}</h3>
        <p className="mt-2 leading-relaxed text-slate-600">
          פיצ&apos;ר זה נעול. נסגור איתכם בשיחה קצרה ונפתח אותו לחשבון שלכם.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href={whatsappTo(lockedFeatureWhatsapp(feature.name))}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-emerald-500 px-5 py-3 font-bold text-white transition hover:bg-emerald-600"
          >
            💬 פתחו לי בוואטסאפ
          </a>
          <a
            href={telHref}
            dir="ltr"
            className="rounded-full border-2 border-slate-200 px-5 py-3 font-bold text-brand-blue transition hover:bg-slate-50"
          >
            📞 050-644-5570
          </a>
        </div>

        <button
          onClick={onClose}
          className="mt-5 text-sm font-bold text-slate-400 hover:text-slate-600"
        >
          סגירה
        </button>
      </div>
    </div>
  );
}
