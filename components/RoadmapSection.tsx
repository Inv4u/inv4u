'use client';

import React, { useState } from 'react';

interface Step {
  title: string;
  text: string;
}

interface EventRoadmap {
  id: string;
  label: string;
  icon: string;
  gradient: string;
  steps: Step[];
}

const roadmaps: EventRoadmap[] = [
  {
    id: 'wedding',
    label: 'חתונה',
    icon: '💍',
    gradient: 'from-grape to-magenta',
    steps: [
      { title: 'עיצוב ההזמנה', text: 'הזמנה דיגיטלית מעוצבת עם וידאו, מוזיקה וניווט לאולם.' },
      { title: 'שליחה חכמה', text: 'שליחה לכל המוזמנים בוואטסאפ ו-SMS בלחיצה אחת.' },
      { title: 'אישורי הגעה', text: 'אישור בלחיצה, ושיחות AI בעברית למי שלא ענה.' },
      { title: 'תזכורות', text: 'תזכורת אוטומטית יום-יומיים לפני, כולל בקשת מספר אורחים.' },
      { title: 'סידור הושבה', text: 'סידור שולחנות לפי אישורי הגעה אמיתיים.' },
      { title: 'יום החתונה', text: 'כניסה עם QR, ספירת אורחים חיה וגלריה משותפת.' },
    ],
  },
  {
    id: 'bar-mitzvah',
    label: 'בר מצווה',
    icon: '🕯️',
    gradient: 'from-brand-blue to-sky',
    steps: [
      { title: 'הזמנה לצעירים ולמבוגרים', text: 'עיצוב מותאם, עם אפשרות לקבוצות חברים נפרדות.' },
      { title: 'שליחה לכל הרשימות', text: 'משפחה, חברים מבית הספר והקהילה — בקבוצות מסודרות.' },
      { title: 'אישורי הגעה', text: 'אישורים מההורים ומהילדים, עם מעקב לפי קבוצה.' },
      { title: 'תזכורות והסעות', text: 'תזכורות אוטומטיות ותיאום הסעות במידת הצורך.' },
      { title: 'הושבה לפי קבוצות', text: 'שולחן ילדים, שולחן משפחה — סידור חכם וקל.' },
      { title: 'יום האירוע', text: 'כניסה עם QR וסיכום נוכחות מלא בסוף הערב.' },
    ],
  },
  {
    id: 'brit',
    label: 'ברית',
    icon: '👶',
    gradient: 'from-brand-teal to-emerald-500',
    steps: [
      { title: 'הזמנה מהירה', text: 'אירוע מתארגן מהר — הזמנה דיגיטלית מוכנה תוך דקות.' },
      { title: 'שליחה מיידית', text: 'הודעה לכל המשפחה והחברים ברגע שנקבע התאריך.' },
      { title: 'אישורים בזמן אמת', text: 'מי מגיע לבוקר? אישור מהיר בוואטסאפ.' },
      { title: 'תזכורת בוקר האירוע', text: 'תזכורת אוטומטית עם כתובת וניווט.' },
      { title: 'ספירת אורחים', text: 'הערכת כמות מדויקת לקייטרינג — בלי לבזבז.' },
      { title: 'תודה אוטומטית', text: 'הודעת תודה חמה לכל מי שהגיע לחגוג.' },
    ],
  },
  {
    id: 'corporate',
    label: 'אירוע עסקי',
    icon: '💼',
    gradient: 'from-sunset to-gold',
    steps: [
      { title: 'הזמנה ממותגת', text: 'עיצוב עם לוגו וצבעי החברה, מראה מקצועי.' },
      { title: 'שליחה לעובדים/לקוחות', text: 'רשימות מסודרות לפי מחלקות או קהלים.' },
      { title: 'רישום ואישור', text: 'אישור הגעה עם שאלות מותאמות (העדפות, אלרגיות).' },
      { title: 'תזכורות אוטומטיות', text: 'תזכורות ועדכונים שמורידים אחוזי no-show.' },
      { title: 'ניהול כניסה', text: 'צ׳ק-אין עם QR ותגי שם, דוחות נוכחות בזמן אמת.' },
      { title: 'דוח סיכום', text: 'ייצוא נתונים מלא לאקסל ל-ROI ולמעקב.' },
    ],
  },
];

export default function RoadmapSection() {
  const [active, setActive] = useState(0);
  const current = roadmaps[active];

  return (
    <section className="bg-white px-4 py-24" dir="rtl" id="roadmap">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-brand-blue/10 px-4 py-1.5 text-sm font-bold text-brand-blue">
            מסלול לכל אירוע
          </span>
          <h2 className="mt-4 text-4xl font-black text-brand-navy md:text-5xl">
            איך INV4U <span className="text-gradient">מנהל את האירוע שלך</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-slate-600">
            בחרו סוג אירוע וראו את המסלול שלב אחר שלב
          </p>
        </div>

        {/* event tabs */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {roadmaps.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 rounded-full px-5 py-3 font-bold transition-all ${
                i === active
                  ? `bg-gradient-to-r ${r.gradient} text-white shadow-lg scale-105`
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="text-xl">{r.icon}</span>
              {r.label}
            </button>
          ))}
        </div>

        {/* timeline */}
        <div key={current.id} className="relative animate-fade-in">
          {/* vertical line (RTL: on the right) */}
          <div className="absolute right-[27px] top-2 bottom-2 w-0.5 bg-slate-200 md:right-1/2 md:translate-x-1/2" />

          <div className="space-y-6">
            {current.steps.map((step, idx) => (
              <div
                key={idx}
                className="animate-fade-in-up relative flex items-start gap-5 md:justify-center"
                style={{ animationDelay: `${idx * 90}ms` }}
              >
                <div
                  className={`relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${current.gradient} text-lg font-black text-white shadow-lg md:absolute md:right-1/2 md:translate-x-1/2`}
                >
                  {idx + 1}
                </div>
                <div
                  className={`rounded-2xl bg-slate-50 p-5 shadow-sm ring-1 ring-slate-100 md:w-[calc(50%-3rem)] ${
                    idx % 2 === 0 ? 'md:ml-auto md:mr-0' : 'md:mr-auto md:ml-0 md:text-right'
                  }`}
                >
                  <h3 className="text-lg font-black text-brand-navy">{step.title}</h3>
                  <p className="mt-1 text-slate-600">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
