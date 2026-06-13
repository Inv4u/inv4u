'use client';

import React, { useState } from 'react';

interface QA {
  q: string;
  a: string;
}

// Process-specific questions for the dedicated /how-it-works page.
const faqs: QA[] = [
  {
    q: 'כמה זמן באמת לוקח להקים אירוע מההתחלה?',
    a: 'רוב האנשים מסיימים תוך 10–15 דקות: בוחרים עיצוב, ממלאים פרטים ומעלים את רשימת המוזמנים. אפשר תמיד לחזור ולערוך אחר כך, וגם אנחנו כאן ללוות אתכם בכל שלב.',
  },
  {
    q: 'אני לא אדם טכנולוגי — זה מסובך מדי בשבילי?',
    a: 'ממש לא. המערכת בנויה כך שכל אחד יכול להשתמש בה, גם בלי רקע טכני. הכל בעברית, צעד אחר צעד, ואם נתקעתם — שלחו לנו הודעה ונעזור לכם להקים את האירוע.',
  },
  {
    q: 'מה קורה אם מוזמן לא משתמש בוואטסאפ?',
    a: 'אפשר לשלוח לאותו מוזמן הזמנה ואישור הגעה גם ב-SMS. הוא מאשר באותה קלות, והתשובה נכנסת לאותו לוח בקרה יחד עם כל השאר.',
  },
  {
    q: 'שלחתי כבר את ההזמנות — אפשר עדיין לערוך?',
    a: 'כן. אפשר לעדכן פרטים, להוסיף מוזמנים או לשנות תאריך גם אחרי השליחה. מי שכבר אישר יקבל את הפרטים המעודכנים אוטומטית.',
  },
  {
    q: 'אורח רוצה לשנות את התשובה שלו — צריך להתקשר אליו?',
    a: 'לא צריך לעשות כלום. האורח פשוט נכנס שוב לקישור ומעדכן את עצמו — מאישור לביטול או להפך — והלוח שלכם מתעדכן מיד.',
  },
  {
    q: 'איך כל התהליך הזה חוסך לי כסף?',
    a: 'כי אתם מגיעים לאולם ולקייטרינג עם מספר אורחים מדויק. בלי לשלם על עשרות מנות מיותרות "ליתר ביטחון", ובלי שעות עבודה על טלפונים ואקסלים.',
  },
];

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: QA;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 p-5 text-right transition hover:bg-slate-50"
      >
        <span className="text-lg font-bold text-brand-navy">{item.q}</span>
        <span
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-grape text-lg font-bold text-white transition-transform duration-300 ${
            isOpen ? 'rotate-45' : ''
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 leading-relaxed text-slate-600">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function ProcessFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-mesh-light px-4 py-24" dir="rtl">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-brand-blue/10 px-4 py-1.5 text-sm font-bold text-brand-blue">
            שאלות על התהליך
          </span>
          <h2 className="mt-4 text-4xl font-black text-brand-navy md:text-5xl">
            כל מה ש<span className="text-gradient">חשוב לדעת</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xl text-slate-600">
            השאלות שהכי שואלים אותנו על איך זה עובד בפועל
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
