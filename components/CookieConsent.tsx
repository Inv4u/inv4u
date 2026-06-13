'use client';

import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'inv4u_cookie_consent';

type Consent = 'accepted' | 'rejected';

export default function CookieConsent() {
  // Start hidden; reveal only after we've checked localStorage on the client,
  // so the banner never flashes for users who already chose.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== 'accepted' && saved !== 'rejected') {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable (private mode / blocked) — show the banner.
      setVisible(true);
    }
  }, []);

  const choose = (consent: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, consent);
    } catch {
      // Ignore storage errors — worst case the banner reappears next visit.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      dir="rtl"
      role="dialog"
      aria-live="polite"
      aria-label="הגדרות עוגיות"
      className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-white/10 bg-[#0D1B4B] p-5 text-white shadow-2xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p className="text-sm leading-relaxed text-slate-200">
          אנחנו משתמשים בעוגיות חיוניות להפעלת האתר ובעוגיות נוספות לשיפור החוויה.
          <span className="block text-slate-400">
            We use essential cookies to run the site and optional ones to improve your experience.
          </span>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose('rejected')}
            className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
          >
            דחיית לא-חיוניות
          </button>
          <button
            type="button"
            onClick={() => choose('accepted')}
            className="rounded-full bg-[#1A56DB] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1349c9]"
          >
            אישור
          </button>
        </div>
      </div>
    </div>
  );
}
