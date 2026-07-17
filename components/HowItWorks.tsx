'use client';

import React, { useRef } from 'react';
import { Check } from 'lucide-react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Illustrations — simple inline SVGs, navy / blue / teal palette     */
/* ------------------------------------------------------------------ */

const NAVY = '#0D1B4B';
const BLUE = '#1A56DB';
const TEAL = '#00C2A8';
const GRAY = '#F4F5F7';

interface IllustrationProps {
  className?: string;
}

/* Step 1 — creating the event (form + cursor) */
function CreateEventArt({ className = '' }: IllustrationProps) {
  return (
    <svg viewBox="0 0 360 320" className={className} role="img" aria-label="יצירת אירוע">
      <rect x="40" y="34" width="280" height="232" rx="22" fill="#fff" stroke={GRAY} strokeWidth="2" />
      <rect x="40" y="34" width="280" height="56" rx="22" fill={NAVY} />
      <rect x="40" y="68" width="280" height="22" fill={NAVY} />
      <circle cx="70" cy="62" r="6" fill={TEAL} />
      <rect x="86" y="56" width="120" height="12" rx="6" fill="#ffffff" opacity="0.85" />
      {/* form rows */}
      <rect x="68" y="116" width="90" height="11" rx="5.5" fill={NAVY} opacity="0.55" />
      <rect x="68" y="134" width="224" height="30" rx="9" fill={GRAY} />
      <rect x="68" y="180" width="70" height="11" rx="5.5" fill={NAVY} opacity="0.55" />
      <rect x="68" y="198" width="224" height="30" rx="9" fill={GRAY} />
      {/* primary button */}
      <rect x="196" y="240" width="96" height="34" rx="17" fill={BLUE} />
      <rect x="214" y="253" width="60" height="9" rx="4.5" fill="#fff" />
      {/* cursor */}
      <g>
        <path
          d="M243 250 l0 40 l11 -12 l7 16 l8 -4 l-7 -15 l16 -1 Z"
          fill={NAVY}
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/* Shared phone frame */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <g>
      <rect x="110" y="20" width="170" height="300" rx="30" fill={NAVY} />
      <rect x="120" y="32" width="150" height="276" rx="20" fill="#fff" />
      <rect x="166" y="40" width="58" height="9" rx="4.5" fill={NAVY} opacity="0.25" />
      {children}
    </g>
  );
}

/* Step 2 — sending WhatsApp invitations */
function SendInvitesArt({ className = '' }: IllustrationProps) {
  return (
    <svg viewBox="0 0 390 340" className={className} role="img" aria-label="שליחת הזמנות בוואטסאפ">
      <PhoneFrame>
        {/* incoming invitation bubble (RTL: aligned right) */}
        <rect x="138" y="70" width="118" height="74" rx="16" fill="#E7F8F2" />
        <rect x="152" y="86" width="90" height="9" rx="4.5" fill={NAVY} opacity="0.7" />
        <rect x="152" y="102" width="70" height="9" rx="4.5" fill={NAVY} opacity="0.45" />
        <rect x="152" y="120" width="84" height="14" rx="7" fill={TEAL} />
        {/* outgoing send rows */}
        <rect x="150" y="166" width="96" height="12" rx="6" fill={BLUE} opacity="0.85" />
        <rect x="166" y="190" width="80" height="12" rx="6" fill={BLUE} opacity="0.55" />
        <rect x="178" y="214" width="68" height="12" rx="6" fill={BLUE} opacity="0.3" />
      </PhoneFrame>
      {/* paper-plane send burst */}
      <g>
        <circle cx="86" cy="120" r="30" fill={BLUE} />
        <path d="M72 120 l30 -12 l-11 12 l11 12 Z" fill="#fff" />
      </g>
      <circle cx="64" cy="200" r="7" fill={TEAL} />
      <circle cx="92" cy="232" r="5" fill={BLUE} opacity="0.5" />
      <circle cx="120" cy="206" r="4" fill={TEAL} opacity="0.7" />
    </svg>
  );
}

/* Step 3 — RSVPs come in, dashboard counter updates */
function RsvpArt({ className = '' }: IllustrationProps) {
  return (
    <svg viewBox="0 0 390 340" className={className} role="img" aria-label="אישורי הגעה ולוח בקרה">
      <PhoneFrame>
        {/* reply bubbles with check marks */}
        <rect x="146" y="70" width="104" height="30" rx="12" fill={GRAY} />
        <circle cx="162" cy="85" r="9" fill={TEAL} />
        <path d="M158 85 l3 3 l6 -6" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="178" y="80" width="58" height="9" rx="4.5" fill={NAVY} opacity="0.6" />
        <rect x="146" y="110" width="104" height="30" rx="12" fill={GRAY} />
        <circle cx="162" cy="125" r="9" fill={TEAL} />
        <path d="M158 125 l3 3 l6 -6" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="178" y="120" width="48" height="9" rx="4.5" fill={NAVY} opacity="0.6" />
        <rect x="146" y="150" width="104" height="30" rx="12" fill={GRAY} />
        <circle cx="162" cy="165" r="9" fill={TEAL} />
        <path d="M158 165 l3 3 l6 -6" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="178" y="160" width="62" height="9" rx="4.5" fill={NAVY} opacity="0.6" />
      </PhoneFrame>
      {/* floating dashboard counter card */}
      <g>
        <rect x="40" y="196" width="118" height="96" rx="18" fill="#fff" stroke={GRAY} strokeWidth="2" />
        <rect x="58" y="214" width="60" height="10" rx="5" fill={NAVY} opacity="0.5" />
        <text x="58" y="262" fontFamily="Rubik, sans-serif" fontSize="38" fontWeight="800" fill={BLUE}>
          142
        </text>
        <rect x="58" y="272" width="82" height="8" rx="4" fill={TEAL} opacity="0.35" />
        <rect x="58" y="272" width="58" height="8" rx="4" fill={TEAL} />
      </g>
    </svg>
  );
}

/* Step 4 — AI voice follow-up (microphone + soundwave) */
function AiCallArt({ className = '' }: IllustrationProps) {
  const bars = [22, 44, 70, 96, 70, 50, 84, 38, 60, 30];
  return (
    <svg viewBox="0 0 360 320" className={className} role="img" aria-label="שיחת מעקב של AI">
      <circle cx="180" cy="160" r="120" fill={GRAY} />
      {/* soundwave */}
      <g transform="translate(60,160)">
        {bars.map((h, i) => (
          <rect
            key={i}
            x={i * 25}
            y={-h / 2}
            width="11"
            height={h}
            rx="5.5"
            fill={i % 2 === 0 ? BLUE : TEAL}
            opacity={0.55 + (i % 3) * 0.15}
          />
        ))}
      </g>
      {/* microphone */}
      <g transform="translate(180,150)">
        <rect x="-18" y="-58" width="36" height="74" rx="18" fill={NAVY} />
        <path d="M-30 -6 a30 30 0 0 0 60 0" fill="none" stroke={NAVY} strokeWidth="6" strokeLinecap="round" />
        <rect x="-3" y="24" width="6" height="20" rx="3" fill={NAVY} />
        <rect x="-20" y="44" width="40" height="6" rx="3" fill={NAVY} />
        <circle cx="0" cy="-34" r="5" fill={TEAL} />
      </g>
    </svg>
  );
}

/* Step 5 — the perfect event (confetti + complete guest list) */
function PerfectEventArt({ className = '' }: IllustrationProps) {
  const confetti = [
    { x: 44, y: 40, c: BLUE, r: 6 },
    { x: 300, y: 54, c: TEAL, r: 7 },
    { x: 80, y: 96, c: TEAL, r: 5 },
    { x: 320, y: 120, c: BLUE, r: 5 },
    { x: 40, y: 150, c: NAVY, r: 4 },
    { x: 330, y: 210, c: TEAL, r: 6 },
    { x: 58, y: 230, c: BLUE, r: 5 },
  ];
  return (
    <svg viewBox="0 0 360 320" className={className} role="img" aria-label="רשימת אורחים מלאה ומדויקת">
      {confetti.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.c} opacity="0.8" />
      ))}
      {/* guest list card */}
      <rect x="74" y="56" width="212" height="208" rx="22" fill="#fff" stroke={GRAY} strokeWidth="2" />
      <rect x="74" y="56" width="212" height="50" rx="22" fill={BLUE} />
      <rect x="74" y="84" width="212" height="22" fill={BLUE} />
      <rect x="98" y="74" width="118" height="14" rx="7" fill="#fff" opacity="0.9" />
      {[0, 1, 2, 3].map((row) => (
        <g key={row} transform={`translate(0, ${row * 38})`}>
          <circle cx="110" cy="142" r="11" fill={TEAL} />
          <path
            d="M105 142 l3.5 3.5 l7 -7"
            stroke="#fff"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="130" y="130" width="100" height="11" rx="5.5" fill={NAVY} opacity="0.65" />
          <rect x="130" y="147" width="64" height="9" rx="4.5" fill={NAVY} opacity="0.3" />
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Step data                                                          */
/* ------------------------------------------------------------------ */

interface Step {
  id: string;
  num: string;
  headline: string;
  description: string;
  Art: React.ComponentType<IllustrationProps>;
  // Richer copy shown only on the dedicated /how-it-works page.
  longDescription: string;
  details: string[];
}

const STEPS: Step[] = [
  {
    id: 'create',
    num: '01',
    headline: 'יצירת האירוע',
    description:
      'בונים את האירוע ב-INV4U תוך דקות — בוחרים עיצוב, מוסיפים פרטים, ומעלים את רשימת המוזמנים.',
    Art: CreateEventArt,
    longDescription:
      'נכנסים למערכת, בוחרים את סוג האירוע ואת העיצוב שמדבר אליכם, וממלאים את הפרטים — תאריך, מקום, שעה וטקסט אישי. מעלים את רשימת המוזמנים מקובץ Excel/CSV או מדביקים ישירות מאנשי הקשר. תוך דקות ספורות ההזמנה הדיגיטלית מוכנה לשליחה, ואנחנו כאן ללוות אתכם בכל שלב.',
    details: [
      'עשרות עיצובים מקצועיים מוכנים, או עיצוב אישי לחלוטין',
      'העלאת רשימת מוזמנים מ-Excel/CSV או מאנשי הקשר',
      'הוספת וידאו, מוזיקה, ניווט לאולם וברכה אישית',
    ],
  },
  {
    id: 'send',
    num: '02',
    headline: 'שליחת הזמנות',
    description:
      'המערכת שולחת הזמנה דיגיטלית בוואטסאפ לכל המוזמנים בלחיצה אחת — בלי טלפונים ובלי אקסלים.',
    Art: SendInvitesArt,
    longDescription:
      'בלחיצת כפתור המערכת שולחת לכל מוזמן הזמנה דיגיטלית אישית בוואטסאפ — עם השם שלו, הפרטים וקישור ייעודי לאישור הגעה. בלי להעתיק הודעות אחת-אחת, בלי אקסלים ובלי שיחות טלפון. כל מוזמן מקבל בדיוק את ההודעה הנכונה, בזמן הנכון.',
    details: [
      'שליחה המונית בוואטסאפ בלחיצה אחת',
      'הודעה אישית עם שם המוזמן וקישור ייעודי לכל אחד',
      'תזכורות אוטומטיות למי שלא פתח או לא הגיב',
    ],
  },
  {
    id: 'rsvp',
    num: '03',
    headline: 'אישורי הגעה',
    description:
      'האורחים מאשרים הגעה ישירות בוואטסאפ, ולוח הבקרה שלכם מתעדכן בזמן אמת — כל הנתונים במקום אחד.',
    Art: RsvpArt,
    longDescription:
      'האורחים מאשרים הגעה ישירות בתוך הוואטסאפ — מגיעים, לא מגיעים או טרם החליטו, וגם כמה אורחים. כל תשובה נכנסת מיד ללוח הבקרה ומתעדכנת בזמן אמת. אתם רואים בכל רגע כמה אישרו, כמה חסרים ומי עדיין לא ענה — בלי לרדוף אחרי אף אחד.',
    details: [
      'אישור בלחיצה אחת — בלי אפליקציה ובלי הרשמה',
      'בחירת מספר אורחים והעדפות (למשל מנה צמחונית)',
      'לוח בקרה חי שמתעדכן עם כל תשובה',
    ],
  },
  {
    id: 'ai',
    num: '04',
    headline: 'AI עוקב',
    description:
      'מי שלא ענה? סוכן AI מתקשר בקול אנושי בעברית, מקבל תשובה מסודרת ומעדכן את הרשימה אוטומטית.',
    Art: AiCallArt,
    longDescription:
      'את מי שלא ענה גם אחרי התזכורות, סוכן AI מתקשר אליו בשיחה קולית בעברית טבעית. הוא מציג את עצמו, שואל אם יגיעו, מבין תשובות חופשיות ומעדכן את הרשימה לבד. כל שיחה מתומללת אוטומטית, כך שיש לכם תיעוד מלא — בלי להרים טלפון אחד בעצמכם.',
    details: [
      'שיחות קוליות ב-AI בעברית טבעית למי שלא הגיב',
      'הבנת תשובות חופשיות ועדכון אוטומטי של הסטטוס',
      'תמלול מלא של כל שיחה ישירות בלוח הבקרה',
    ],
  },
  {
    id: 'perfect',
    num: '05',
    headline: 'האירוע המושלם',
    description:
      'אתם מגיעים לאירוע עם רשימת אורחים מלאה, מדויקת ומעודכנת — בלי הפתעות ובלי כאב ראש.',
    Art: PerfectEventArt,
    longDescription:
      'ביום האירוע אתם מגיעים עם רשימת אורחים סופית, מדויקת ומעודכנת — יודעים בדיוק כמה מנות להזמין, איך לסדר את ההושבה ומי הגיע. בלי הפתעות של הרגע האחרון, בלי טבלאות ידניות ובלי כאב ראש. אתם פשוט נהנים מהאירוע.',
    details: [
      'רשימת אורחים סופית ומדויקת לאולם ולקייטרינג',
      'הערכת מנות חכמה שמונעת הזמנת מנות מיותרות',
      'ייצוא הנתונים והושבה חכמה בלחיצה',
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Single step block — alternates sides, parallax on the art          */
/* ------------------------------------------------------------------ */

const textVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const artVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
};

function StoryStep({
  step,
  index,
  expanded = false,
}: {
  step: Step;
  index: number;
  expanded?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // subtle parallax on the illustration; disabled for reduced motion
  const yRaw = useTransform(scrollYProgress, [0, 1], [48, -48]);
  const y = reduce ? 0 : yRaw;

  // In RTL, text naturally sits on the right. Alternate by reversing order
  // on desktop so the illustration switches sides each step.
  const reverse = index % 2 === 1;
  const { Art } = step;

  return (
    <div ref={ref} className="flex items-center py-12 md:py-16">
      <div
        className={`mx-auto grid w-full max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:gap-16 ${
          reverse ? 'md:[direction:ltr]' : ''
        }`}
      >
        {/* Illustration */}
        <motion.div
          style={{ y }}
          variants={reduce ? undefined : artVariants}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={{ once: true, amount: 0.4 }}
          className="order-1 flex justify-center md:order-none"
        >
          <div className="relative w-full max-w-sm" style={{ direction: 'rtl' }}>
            <div className="absolute inset-0 -z-10 translate-y-6 scale-95 rounded-[40px] bg-brand-blue/5 blur-2xl" />
            <Art className="h-auto w-full drop-shadow-sm" />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          variants={reduce ? undefined : textVariants}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={{ once: true, amount: 0.4 }}
          className="order-2 text-center md:order-none md:text-right"
          style={{ direction: 'rtl' }}
        >
          <motion.div
            variants={reduce ? undefined : itemVariants}
            className="mb-4 flex items-center justify-center gap-3 md:justify-start"
          >
            <span className="text-5xl font-black text-brand-blue/15 md:text-6xl">
              {step.num}
            </span>
            <span className="h-px w-12 bg-brand-blue/25" />
          </motion.div>

          <motion.h3
            variants={reduce ? undefined : itemVariants}
            className="text-3xl font-black leading-tight text-brand-navy md:text-4xl lg:text-5xl"
          >
            {step.headline}
          </motion.h3>

          <motion.p
            variants={reduce ? undefined : itemVariants}
            className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-slate-600 md:mx-0 md:text-xl"
          >
            {expanded ? step.longDescription : step.description}
          </motion.p>

          {expanded && (
            <motion.ul
              variants={reduce ? undefined : itemVariants}
              className="mx-auto mt-6 max-w-md space-y-2.5 text-right md:mx-0"
            >
              {step.details.map((detail) => (
                <li
                  key={detail}
                  className="flex items-start gap-3 text-base text-slate-700"
                >
                  <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-teal/15 text-brand-teal">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span>{detail}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function HowItWorks({ expanded = false }: { expanded?: boolean }) {
  const reduce = useReducedMotion();

  return (
    <section id="how-it-works" dir="rtl" className="relative bg-white">
      {/* Section heading — the dedicated page supplies its own hero instead. */}
      {!expanded && (
        <div className="mx-auto max-w-3xl px-6 pt-24 pb-4 text-center md:pt-28">
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
            className="inline-block rounded-full bg-brand-blue/10 px-4 py-1.5 text-sm font-bold text-brand-blue"
          >
            איך זה עובד
          </motion.span>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-4 text-4xl font-black text-brand-navy md:text-5xl"
          >
            מהזמנה ראשונה ועד האירוע המושלם
          </motion.h2>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl text-lg text-slate-600 md:text-xl"
          >
            חמישה שלבים פשוטים. INV4U מנהל את כולם בשבילכם.
          </motion.p>
        </div>
      )}

      {/* Steps */}
      {STEPS.map((step, i) => (
        <StoryStep key={step.id} step={step} index={i} expanded={expanded} />
      ))}
    </section>
  );
}
