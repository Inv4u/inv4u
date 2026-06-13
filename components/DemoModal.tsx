'use client';

import React, { useEffect, useState } from 'react';

interface Step {
  icon: string;
  title: string;
  text: string;
  gradient: string;
}

const steps: Step[] = [
  {
    icon: '💌',
    title: 'שולחים הזמנה דיגיטלית',
    text: 'בוחרים עיצוב, מוסיפים וידאו וניווט לאולם, ושולחים לכל המוזמנים בוואטסאפ — בלחיצה אחת.',
    gradient: 'from-grape to-magenta',
  },
  {
    icon: '🤖',
    title: 'המערכת אוספת אישורים לבד',
    text: 'תזכורות אוטומטיות ושיחות AI בעברית טבעית למי שלא ענה. אתם רק צופים — המערכת עושה את העבודה.',
    gradient: 'from-brand-blue to-sky',
  },
  {
    icon: '📊',
    title: 'מנהלים הכל מלוח בקרה אחד',
    text: 'הושבה חכמה, ספירת אורחים, מעקב חי וייצוא נתונים. חוסכים שעות עבודה ומונעים מנות מיותרות.',
    gradient: 'from-brand-teal to-emerald-500',
  },
];

export default function DemoModal({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowLeft') setStep((s) => Math.min(steps.length - 1, s + 1));
      if (e.key === 'ArrowRight') setStep((s) => Math.max(0, s - 1));
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const openModal = () => {
    setStep(0);
    setOpen(true);
  };

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <>
      <button onClick={openModal} className={className || 'btn-ghost'}>
        <span className="text-lg">▶</span> צפו בדמו
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
          dir="rtl"
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* close */}
            <button
              onClick={() => setOpen(false)}
              aria-label="סגירה"
              className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-slate-500 transition hover:bg-black/10"
            >
              ✕
            </button>

            {/* visual header */}
            <div className={`relative bg-gradient-to-br ${current.gradient} px-8 pt-12 pb-10 text-center text-white`}>
              <div className="pointer-events-none absolute -top-8 right-8 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 text-5xl ring-1 ring-white/30 animate-floaty">
                {current.icon}
              </div>
              <p className="relative mt-4 text-sm font-bold uppercase tracking-widest text-white/80">
                שלב {step + 1} מתוך {steps.length}
              </p>
            </div>

            {/* body */}
            <div className="px-8 py-7 text-center">
              <h3 className="text-2xl font-black text-brand-navy">{current.title}</h3>
              <p className="mx-auto mt-3 max-w-sm leading-relaxed text-slate-600">{current.text}</p>

              {/* progress dots */}
              <div className="mt-6 flex justify-center gap-2">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    aria-label={`שלב ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === step ? 'w-7 bg-brand-blue' : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              {/* controls */}
              <div className="mt-7 flex items-center justify-between gap-3">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="rounded-full px-5 py-2.5 font-bold text-slate-500 transition hover:bg-slate-100 disabled:opacity-0"
                >
                  הקודם
                </button>
                {isLast ? (
                  <a href="#contact" onClick={() => setOpen(false)} className="btn-primary !py-2.5">
                    קבעו שיחת ייעוץ
                  </a>
                ) : (
                  <button
                    onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                    className="btn-primary !py-2.5"
                  >
                    הבא
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
