'use client';

import React, { useEffect, useState } from 'react';

const SCREENS = ['invitation', 'rsvp', 'dashboard'] as const;
const SCREEN_LABELS: Record<(typeof SCREENS)[number], string> = {
  invitation: 'הזמנה',
  rsvp: 'אישור הגעה',
  dashboard: 'לוח בקרה',
};

/**
 * A stylised phone that auto-rotates between three screens guests/hosts see:
 * an elegant invitation, the RSVP flow, and the host dashboard.
 */
export default function PhoneMockup() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SCREENS.length), 4200);
    return () => clearInterval(id);
  }, [paused]);

  const current = SCREENS[index];

  return (
    <div
      className="relative mx-auto w-[280px] sm:w-[300px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* glow behind the phone */}
      <div className="absolute -inset-8 bg-gradient-to-tr from-grape via-magenta to-brand-blue opacity-40 blur-3xl rounded-full" />

      {/* phone body */}
      <div className="relative rounded-[2.6rem] bg-slate-900 p-2.5 shadow-2xl ring-1 ring-white/10">
        {/* notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-2xl z-20" />

        {/* screen */}
        <div className="relative rounded-[2.1rem] overflow-hidden bg-white h-[580px]" dir="rtl">
          <div key={current} className="absolute inset-0 animate-fade-in">
            {current === 'invitation' && <InvitationScreen />}
            {current === 'rsvp' && (
              <RsvpScreen
                answer={answer}
                setAnswer={setAnswer}
                guests={guests}
                setGuests={setGuests}
              />
            )}
            {current === 'dashboard' && <DashboardScreen />}
          </div>
        </div>
      </div>

      {/* screen indicators */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {SCREENS.map((s, i) => (
          <button
            key={s}
            onClick={() => setIndex(i)}
            aria-label={SCREEN_LABELS[s]}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-7 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* floating confirmation bubble */}
      <div className="absolute bottom-12 -left-4 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-xl animate-floaty">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white">✓</span>
        <div className="leading-tight">
          <p className="text-[11px] font-bold text-slate-800">אישור התקבל</p>
          <p className="text-[10px] text-slate-400">לפני 2 דקות</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Invitation (elegant: white / gold / silver / pink / green) -------------- */
function InvitationScreen() {
  return (
    <div className="relative h-full bg-[#FFFDF8] px-6 py-8 text-center">
      {/* soft pink & green corner washes */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#F6D7DE] opacity-70 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#DDEBD6] opacity-70 blur-2xl" />

      {/* floral corners */}
      <span className="absolute left-3 top-3 text-2xl opacity-90 select-none">🌿</span>
      <span className="absolute right-3 top-3 text-2xl opacity-90 -scale-x-100 select-none">🌸</span>
      <span className="absolute left-3 bottom-3 text-2xl opacity-90 select-none">🌷</span>
      <span className="absolute right-3 bottom-3 text-2xl opacity-90 -scale-x-100 select-none">🍃</span>

      {/* gold double frame */}
      <div className="relative flex h-full flex-col items-center justify-center rounded-2xl border border-[#C9A227]/60 p-5 ring-1 ring-inset ring-[#C9A227]/30">
        <p className="text-[11px] font-medium tracking-[0.3em] text-[#B0904A]">
          הזמנה לחתונה
        </p>

        <div className="my-3 flex items-center gap-2 text-[#C9A227]">
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#C9A227]" />
          <span className="text-sm">🌸</span>
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#C9A227]" />
        </div>

        <h3
          className="text-3xl font-black leading-tight text-transparent bg-clip-text"
          style={{ backgroundImage: 'linear-gradient(135deg,#B38728,#D4AF37,#9C7A2E)' }}
        >
          דנה
          <span className="mx-2 align-middle text-2xl text-[#C9A227]">&amp;</span>
          יוסי
        </h3>

        <p className="mt-3 text-sm font-medium text-slate-500">מתחתנים!</p>

        <div className="my-4 h-px w-24 bg-gradient-to-r from-transparent via-[#BFC3C9] to-transparent" />

        <p className="text-sm font-bold text-slate-700">יום חמישי · 14.08.2026</p>
        <p className="mt-1 text-xs text-slate-500">אולמי הגן הקסום, ראשון לציון</p>

        <div className="mt-5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B38728] px-6 py-2 text-xs font-bold text-white shadow-md">
          לצפייה בהזמנה המלאה
        </div>

        <div className="mt-3 flex gap-1.5 text-sm">
          <span>🌷</span><span>🌿</span><span>🌸</span><span>🍃</span><span>🌷</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- RSVP ---------------- */
function RsvpScreen({
  answer,
  setAnswer,
  guests,
  setGuests,
}: {
  answer: 'yes' | 'no' | null;
  setAnswer: (a: 'yes' | 'no') => void;
  guests: number;
  setGuests: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div className="h-full bg-white">
      <div className="relative bg-gradient-to-br from-grape via-magenta to-brand-blue px-5 pt-10 pb-6 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
        <p className="relative text-xs opacity-90">דנה &amp; יוסי · 14.08.2026</p>
        <h3 className="relative mt-1 text-2xl font-black">אישור הגעה</h3>
      </div>

      <div className="px-5 py-5 space-y-4">
        <p className="text-center text-sm font-bold text-slate-700">האם תגיעו לחגוג איתנו? 🥂</p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setAnswer('yes')}
            className={`rounded-xl py-2.5 text-sm font-bold transition-all ${
              answer === 'yes' ? 'bg-emerald-500 text-white shadow-lg scale-[1.03]' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            ✓ מגיעים
          </button>
          <button
            onClick={() => setAnswer('no')}
            className={`rounded-xl py-2.5 text-sm font-bold transition-all ${
              answer === 'no' ? 'bg-rose-500 text-white shadow-lg scale-[1.03]' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
            }`}
          >
            ✗ לא נוכל
          </button>
        </div>

        {answer === 'yes' && (
          <div className="animate-fade-in-up space-y-3">
            <p className="text-center text-xs font-bold text-slate-600">כמה אתם מגיעים?</p>
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => setGuests((g) => Math.max(1, g - 1))} className="h-9 w-9 rounded-full bg-slate-100 text-lg font-bold text-slate-700 hover:bg-slate-200">−</button>
              <span className="w-8 text-center text-2xl font-black text-brand-navy">{guests}</span>
              <button onClick={() => setGuests((g) => Math.min(20, g + 1))} className="h-9 w-9 rounded-full bg-brand-blue text-lg font-bold text-white hover:bg-blue-700">+</button>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
              <p className="text-sm font-bold text-emerald-700">מעולה! נתראה בשמחה 🎉</p>
              <p className="mt-0.5 text-[11px] text-emerald-600">אישור נשלח אליכם בוואטסאפ</p>
            </div>
          </div>
        )}

        {answer === 'no' && (
          <div className="animate-fade-in-up rounded-xl border border-rose-200 bg-rose-50 p-3 text-center">
            <p className="text-sm font-bold text-rose-600">חבל שלא תוכלו 💔</p>
            <p className="mt-0.5 text-[11px] text-rose-500">תודה שעדכנתם אותנו</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[11px] font-medium text-slate-600"><span>📍</span> ניווט לאולם</div>
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[11px] font-medium text-slate-600"><span>📅</span> הוסף ליומן</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function DashboardScreen() {
  const bars = [70, 95, 60, 88, 76, 100];
  return (
    <div className="h-full bg-slate-50">
      <div className="bg-brand-navy px-5 pt-10 pb-5 text-white">
        <p className="text-xs text-slate-300">לוח בקרה · דנה &amp; יוסי</p>
        <div className="mt-1 flex items-end justify-between">
          <h3 className="text-xl font-black">מעקב אישורים</h3>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300">חי 🔴</span>
        </div>
      </div>

      <div className="space-y-3 px-4 py-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-white p-2.5 shadow-sm">
            <div className="text-lg font-black text-emerald-500">312</div>
            <div className="text-[10px] text-slate-500">אישרו</div>
          </div>
          <div className="rounded-xl bg-white p-2.5 shadow-sm">
            <div className="text-lg font-black text-amber-500">48</div>
            <div className="text-[10px] text-slate-500">טרם ענו</div>
          </div>
          <div className="rounded-xl bg-white p-2.5 shadow-sm">
            <div className="text-lg font-black text-rose-400">24</div>
            <div className="text-[10px] text-slate-500">לא מגיעים</div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-grape to-brand-blue p-4 text-center text-white shadow-md">
          <div className="text-3xl font-black">93%</div>
          <div className="text-[11px] opacity-90">אחוז אישורי הגעה</div>
        </div>

        <div className="rounded-xl bg-white p-3 shadow-sm">
          <p className="mb-2 text-[11px] font-bold text-slate-600">אישורים לפי יום</p>
          <div className="flex h-16 items-end justify-between gap-1.5">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-brand-blue to-grape" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
            <span className="font-bold text-slate-700">משפחת כהן</span>
            <span className="mr-auto text-slate-400">אישרו · 4 אורחים</span>
          </div>
        </div>
      </div>
    </div>
  );
}
