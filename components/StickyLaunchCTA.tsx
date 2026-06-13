'use client';

import React, { useEffect, useState } from 'react';

const DISMISS_KEY = 'inv4u_launch_cta_dismissed';

/**
 * Sticky launch-pricing CTA. Honest urgency — we genuinely are in the launch
 * period. Appears after the user scrolls past the hero, sits in the opposite
 * corner from the WhatsApp button, and can be dismissed (remembered).
 */
export default function StickyLaunchCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true); // assume dismissed until checked

  useEffect(() => {
    let isDismissed = false;
    try {
      isDismissed = localStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      isDismissed = false;
    }
    setDismissed(isDismissed);
    if (isDismissed) return;

    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // ignore storage errors
    }
  };

  if (dismissed || !visible) return null;

  return (
    <div
      dir="rtl"
      className="fixed bottom-5 left-5 z-50 flex max-w-[260px] items-center gap-3 rounded-2xl bg-brand-navy px-4 py-3 text-white shadow-2xl ring-1 ring-white/10 animate-fade-in-up"
    >
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sunset to-magenta text-lg">
        🎉
      </span>
      <div className="leading-tight">
        <a href="/#contact" className="block text-sm font-black hover:underline">
          תפסו מקום במחירי השקה
        </a>
        <p className="text-[11px] text-slate-300">הטבת משתמשים ראשונים</p>
      </div>
      <button
        onClick={dismiss}
        aria-label="סגירה"
        className="-mr-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/10 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}
