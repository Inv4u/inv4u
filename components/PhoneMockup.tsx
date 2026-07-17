'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bot, Check, MapPin, CalendarPlus } from 'lucide-react';

/* ------------------------------------------------------------------ *
 *  Interactive phone mockup — 5 stages matching the "how it works"    *
 *  story: invitation → WhatsApp delivery → RSVP → AI follow-up →      *
 *  host dashboard. Auto-advances until the user takes control (click, *
 *  keyboard or swipe), then stays in manual mode. Keyboard + touch    *
 *  accessible, and auto-advance is disabled for reduced-motion users. *
 * ------------------------------------------------------------------ */

// Gold accent — intentionally scoped to the invitation mockup only.
const GOLD = '#C9A86C';
const GOLD_SOFT = '#E7D7B8';
// Latin serif for accents (ampersand, numerals); Hebrew serif for the names —
// Cormorant has no Hebrew glyphs, so Hebrew must use Frank Ruhl Libre.
const SERIF = "'Cormorant Garamond', serif";
const HEB_SERIF = "'Frank Ruhl Libre', serif";

// Shared demo details, kept consistent across every screen.
const COUPLE = 'דנה ויוסי';
const EVENT_DATE = 'יום חמישי · 14.8.2026';
const VENUE = 'גני האירוע, ראשון לציון';
const WARM_LINE = 'יהיה לנו לכבוד לחגוג איתכם';

const STAGES = ['invitation', 'whatsapp', 'rsvp', 'ai', 'dashboard'] as const;
type Stage = (typeof STAGES)[number];

const STAGE_LABELS: Record<Stage, string> = {
  invitation: 'ההזמנה',
  whatsapp: 'שליחה בוואטסאפ',
  rsvp: 'אישור הגעה',
  ai: 'שיחת AI',
  dashboard: 'לוח בקרה',
};

const AUTO_ADVANCE_MS = 4600;
// After a manual interaction, resume auto-advancing once the user is idle.
const RESUME_AFTER_MS = 30000;

export default function PhoneMockup() {
  const [index, setIndex] = useState(0);
  const [manual, setManual] = useState(false); // user took control → stop auto
  const [hovered, setHovered] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Shared RSVP interactive state.
  const [answer, setAnswer] = useState<'yes' | 'no' | 'maybe' | null>(null);
  const [guests, setGuests] = useState(2);

  const touchStartX = useRef<number | null>(null);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Respect prefers-reduced-motion (no auto-advance for those users).
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Auto-advance until the user interacts or hovers.
  useEffect(() => {
    if (manual || reduced || hovered) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % STAGES.length),
      AUTO_ADVANCE_MS
    );
    return () => clearInterval(id);
  }, [manual, reduced, hovered]);

  const goTo = (i: number) => {
    // Pause auto-advance and jump directly to the requested stage.
    setManual(true);
    setIndex(((i % STAGES.length) + STAGES.length) % STAGES.length);
    // Resume auto-advance after 30s of no further interaction.
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => setManual(false), RESUME_AFTER_MS);
  };

  // Clear any pending resume timer on unmount.
  useEffect(() => {
    return () => {
      if (resumeRef.current) clearTimeout(resumeRef.current);
    };
  }, []);

  // Keyboard: arrows move between stages (RTL — right = previous).
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(index - 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(index + 1);
    }
  };

  // Touch: swipe left → next stage, swipe right → previous.
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) goTo(index + (dx < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  const current = STAGES[index];

  return (
    <div
      className="relative mx-auto w-[280px] sm:w-[300px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* phone body — focusable carousel, keyboard + swipe enabled */}
      <div
        role="group"
        aria-roledescription="קרוסלה"
        aria-label="הדגמת המערכת — חמישה מסכים"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative rounded-[2.6rem] bg-slate-900 p-2.5 ring-1 ring-black/10 outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
      >
        {/* notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-2xl z-20" />

        {/* screen */}
        <div className="relative rounded-[2.1rem] overflow-hidden bg-white h-[580px]" dir="rtl">
          <div key={current} className="absolute inset-0 animate-fade-in">
            {current === 'invitation' && <InvitationScreen />}
            {current === 'whatsapp' && <WhatsappScreen />}
            {current === 'rsvp' && (
              <RsvpScreen
                answer={answer}
                setAnswer={setAnswer}
                guests={guests}
                setGuests={setGuests}
              />
            )}
            {current === 'ai' && <AiCallScreen />}
            {current === 'dashboard' && <DashboardScreen />}
          </div>
        </div>

        {/* polite announcement for screen readers */}
        <span className="sr-only" aria-live="polite">
          {STAGE_LABELS[current]} — מסך {index + 1} מתוך {STAGES.length}
        </span>
      </div>

      {/* stage navigation tabs — relative + z-20 so they sit above the
          decorative glow/bubble overlays and reliably receive clicks */}
      <div
        className="relative z-20 mt-4 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="ניווט בין מסכי ההדגמה"
      >
        {STAGES.map((s, i) => (
          <button
            key={s}
            role="tab"
            onClick={() => goTo(i)}
            aria-selected={i === index}
            aria-current={i === index ? 'true' : undefined}
            aria-label={STAGE_LABELS[s]}
            title={STAGE_LABELS[s]}
            className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
              i === index
                ? 'w-8 bg-white'
                : 'w-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* floating confirmation bubble — decorative, must not block clicks */}
      <div className="pointer-events-none absolute bottom-16 -left-4 flex items-center gap-2 rounded-2xl border border-black/5 bg-white px-3 py-2 animate-floaty">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white">
          <Check className="h-4 w-4" strokeWidth={3} />
        </span>
        <div className="leading-tight">
          <p className="text-[11px] font-bold text-slate-800">אישור התקבל</p>
          <p className="text-[10px] text-slate-400">לפני 2 דקות</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Stage 1 — typographic wedding invitation (no photo) ---------------- */
function InvitationScreen() {
  return (
    <div className="flex h-full flex-col bg-[#FBF7EF] px-6 py-9 text-center">
      {/* thin gold frame */}
      <div
        className="flex flex-1 flex-col items-center justify-between rounded-sm border py-7"
        style={{ borderColor: GOLD_SOFT }}
      >
        <p
          className="text-[10px] font-semibold tracking-[0.5em] text-slate-500"
          style={{ paddingRight: '0.5em' }}
        >
          הזמנה לחתונה
        </p>

        {/* names, stacked, with a gold Latin ampersand between */}
        <div className="flex flex-col items-center">
          <span
            className="leading-[1.05] text-slate-800"
            style={{ fontFamily: HEB_SERIF, fontSize: '2.5rem', fontWeight: 500 }}
          >
            דנה
          </span>
          <span
            className="my-1 leading-none"
            style={{ fontFamily: SERIF, fontSize: '1.9rem', color: GOLD, fontWeight: 500 }}
          >
            &amp;
          </span>
          <span
            className="leading-[1.05] text-slate-800"
            style={{ fontFamily: HEB_SERIF, fontSize: '2.5rem', fontWeight: 500 }}
          >
            יוסי
          </span>
        </div>

        {/* divider with a small diamond */}
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-10" style={{ background: GOLD_SOFT }} />
          <span className="text-[8px]" style={{ color: GOLD }}>
            ◆
          </span>
          <span className="h-px w-10" style={{ background: GOLD_SOFT }} />
        </div>

        {/* date + venue */}
        <div className="space-y-1" style={{ fontFamily: HEB_SERIF }}>
          <p className="text-[15px] font-medium text-slate-700">יום חמישי, 14 באוגוסט 2026</p>
          <p className="text-[12px] text-slate-500">קבלת פנים 19:00 · חופה 20:00</p>
          <p className="text-[12px] text-slate-500">גני האירוע · ראשון לציון</p>
        </div>

        {/* warm line */}
        <p
          className="max-w-[15rem] text-[13px] leading-relaxed text-slate-500"
          style={{ fontFamily: HEB_SERIF }}
        >
          נשמח לחגוג איתכם את היום המאושר בחיינו
        </p>
      </div>

      {/* RSVP row (part of the live invitation) */}
      <div className="mt-4 grid grid-cols-3 gap-1.5">
        <span
          className="rounded-md py-2 text-[11px] font-bold text-white"
          style={{ background: GOLD }}
        >
          אישור הגעה
        </span>
        <span
          className="rounded-md border py-2 text-[11px] font-bold text-slate-600"
          style={{ borderColor: GOLD_SOFT }}
        >
          לא אגיע
        </span>
        <span
          className="rounded-md border py-2 text-[11px] font-bold text-slate-600"
          style={{ borderColor: GOLD_SOFT }}
        >
          אולי
        </span>
      </div>
    </div>
  );
}

/* ---------------- Stage 2 — WhatsApp, the invitation in use ---------------- */
function WhatsappScreen() {
  return (
    <div className="flex h-full flex-col bg-[#ECE5DD]">
      {/* whatsapp header — real chat, couple's avatar */}
      <div className="flex items-center gap-3 bg-[#075E54] px-4 pb-3 pt-10 text-white">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-[13px] font-bold ring-1 ring-white/25"
          style={{ color: GOLD, fontFamily: HEB_SERIF }}
        >
          ד״י
        </span>
        <div className="leading-tight">
          <p className="text-sm font-bold">{COUPLE} · אישורי הגעה</p>
          <p className="text-[10px] text-white/70">רועי, נועה מקלידים…</p>
        </div>
        <span className="mr-auto text-xs text-white/70">עכשיו</span>
      </div>

      {/* chat */}
      <div className="flex-1 space-y-2 overflow-hidden px-3 py-4">
        <div className="mx-auto w-max rounded-full bg-white/70 px-3 py-1 text-[10px] font-medium text-slate-500">
          היום
        </div>

        {/* outgoing — the invitation itself, with a warm line and read receipt */}
        <div className="ms-auto max-w-[86%] rounded-2xl rounded-tr-sm bg-[#DCF8C6] p-2.5 shadow-sm">
          <p className="text-[12px] font-bold text-slate-800">הוזמנתם לחתונה של {COUPLE}</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">
            {EVENT_DATE} · {VENUE}
          </p>
          <p className="mt-1 text-[11px] italic text-slate-500" style={{ fontFamily: SERIF }}>
            {WARM_LINE}
          </p>
          <p className="mt-1 text-left text-[9px] text-slate-400">
            11:24 <span className="font-bold text-[#53BDEB]">✓✓</span>
          </p>
        </div>

        {/* incoming — confirmed */}
        <div className="me-auto max-w-[82%] rounded-2xl rounded-tl-sm bg-white p-2.5 shadow-sm">
          <p className="text-[10px] font-bold text-magenta">רועי כהן</p>
          <p className="text-[12px] text-slate-700">מגיעים! 2 אנשים</p>
          <p className="text-left text-[9px] text-slate-400">11:26</p>
        </div>

        {/* incoming — maybe (an imperfect, human reply) */}
        <div className="me-auto max-w-[82%] rounded-2xl rounded-tl-sm bg-white p-2.5 shadow-sm">
          <p className="text-[10px] font-bold text-brand-blue">משפחת לוי</p>
          <p className="text-[12px] text-slate-700">אולי נצליח, נעדכן קרוב לתאריך 🙏</p>
          <p className="text-left text-[9px] text-slate-400">11:31</p>
        </div>

        {/* live typing indicator */}
        <div className="me-auto flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-3 py-2.5 shadow-sm">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
        </div>
      </div>

      {/* input bar */}
      <div className="flex items-center gap-2 bg-[#ECE5DD] px-3 pb-4">
        <div className="flex-1 rounded-full bg-white px-4 py-2 text-[11px] text-slate-400">הקלדת הודעה…</div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#075E54] text-white">➤</span>
      </div>
    </div>
  );
}

/* ---------------- Stage 3 — RSVP ---------------- */
function RsvpScreen({
  answer,
  setAnswer,
  guests,
  setGuests,
}: {
  answer: 'yes' | 'no' | 'maybe' | null;
  setAnswer: (a: 'yes' | 'no' | 'maybe') => void;
  guests: number;
  setGuests: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div className="h-full bg-white">
      <div className="bg-brand-navy px-5 pt-10 pb-6 text-center text-white">
        <p className="text-xs text-slate-300">{COUPLE} · {EVENT_DATE}</p>
        <h3 className="mt-1 text-2xl font-black">אישור הגעה</h3>
      </div>

      <div className="px-5 py-5 space-y-4">
        <p className="text-center text-sm font-bold text-slate-700">האם תגיעו לחגוג איתנו? 🥂</p>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setAnswer('yes')}
            className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
              answer === 'yes' ? 'bg-emerald-500 text-white shadow-lg scale-[1.03]' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            ✓ מגיעים
          </button>
          <button
            onClick={() => setAnswer('no')}
            className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
              answer === 'no' ? 'bg-rose-500 text-white shadow-lg scale-[1.03]' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
            }`}
          >
            ✗ לא אגיע
          </button>
          <button
            onClick={() => setAnswer('maybe')}
            className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
              answer === 'maybe' ? 'bg-amber-400 text-white shadow-lg scale-[1.03]' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
            }`}
          >
            ? טרם
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

        {answer === 'maybe' && (
          <div className="animate-fade-in-up rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
            <p className="text-sm font-bold text-amber-600">סבבה, נשמור לכם מקום 🤍</p>
            <p className="mt-0.5 text-[11px] text-amber-500">נזכיר לכם קרוב לתאריך</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[11px] font-medium text-slate-600">
            <MapPin className="h-3.5 w-3.5 text-brand-blue" strokeWidth={2} /> ניווט לאולם
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[11px] font-medium text-slate-600">
            <CalendarPlus className="h-3.5 w-3.5 text-brand-blue" strokeWidth={2} /> הוסף ליומן
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Stage 4 — AI voice follow-up ---------------- */
function AiCallScreen() {
  const bars = [30, 56, 82, 46, 70, 38, 64, 50, 78, 34];
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-brand-navy to-[#070A1F] px-6 pb-6 pt-12 text-center text-white">
      <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-brand-teal">
        שיחה יוצאת · AI
      </p>

      <div className="mx-auto mt-8 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue animate-floaty">
          <Bot className="h-7 w-7 text-white" strokeWidth={2} />
        </div>
      </div>

      <h3 className="mt-5 text-xl font-black">סוכן INV4U מתקשר</h3>
      <p className="mt-1 text-xs text-slate-300">למוזמנים שטרם אישרו הגעה</p>

      {/* live soundwave */}
      <div className="mt-6 flex h-12 items-center justify-center gap-1">
        {bars.map((h, i) => (
          <span
            key={i}
            className="w-1.5 rounded-full bg-brand-teal"
            style={{ height: `${h}%`, opacity: 0.5 + (i % 3) * 0.2 }}
          />
        ))}
      </div>

      {/* transcript snippet */}
      <div className="mt-6 space-y-2 text-right">
        <div className="rounded-2xl rounded-tr-sm bg-white/10 px-3 py-2 text-[11px] leading-relaxed text-slate-100">
          “היי, מדברת מ-INV4U בקשר לחתונה של {COUPLE}. רציתי לוודא — תגיעו לאירוע?”
        </div>
        <div className="ms-auto max-w-[80%] rounded-2xl rounded-tl-sm bg-brand-teal/20 px-3 py-2 text-[11px] text-brand-teal">
          “כן, נגיע שניים!” ✓
        </div>
      </div>

      <p className="mt-auto pt-4 text-[10px] text-slate-400">השיחה תומללה ועודכנה בלוח הבקרה אוטומטית</p>
    </div>
  );
}

/* ---------------- Stage 5 — host dashboard ---------------- */
function DashboardScreen() {
  const bars = [70, 95, 60, 88, 76, 100];
  return (
    <div className="h-full bg-slate-50">
      <div className="bg-brand-navy px-5 pt-10 pb-5 text-white">
        <p className="text-xs text-slate-300">לוח בקרה · {COUPLE}</p>
        <div className="mt-1 flex items-end justify-between">
          <h3 className="text-xl font-black">מעקב אישורים</h3>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> חי
          </span>
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

        <div className="rounded-xl bg-brand-blue p-4 text-center text-white shadow-md">
          <div className="text-3xl font-black">93%</div>
          <div className="text-[11px] opacity-90">אחוז אישורי הגעה</div>
        </div>

        <div className="rounded-xl bg-white p-3 shadow-sm">
          <p className="mb-2 text-[11px] font-bold text-slate-600">אישורים לפי יום</p>
          <div className="flex h-16 items-end justify-between gap-1.5">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-brand-blue" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <span className="font-bold text-slate-700">משפחת כהן</span>
            <span className="mr-auto text-slate-400">אישרו · 4 אורחים</span>
          </div>
        </div>
      </div>
    </div>
  );
}
