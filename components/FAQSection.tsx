'use client';

import React, { useState } from 'react';

interface QA {
  q: string;
  a: string;
}

const faqs: QA[] = [
  {
    q: 'כמה זמן לוקח להקים אירוע במערכת?',
    a: 'דקות ספורות. בוחרים עיצוב, מעלים את רשימת המוזמנים (או מדביקים מאנשי קשר), והמערכת מוכנה לשליחה. אנחנו גם כאן ללוות אתכם בכל שלב.',
  },
  {
    q: 'האם האורחים צריכים להתקין אפליקציה?',
    a: 'בכלל לא. האורחים מקבלים הזמנה ואישור הגעה ישירות בוואטסאפ או ב-SMS, ומאשרים בלחיצה אחת — בלי הורדות ובלי הרשמה.',
  },
  {
    q: 'איך עובדות שיחות ה-AI?',
    a: 'מי שלא הגיב להודעות מקבל שיחה קולית מבינה מלאכותית שמדברת עברית טבעית, מבינה תשובות חופשיות ומאשרת הגעה. כל שיחה מתומללת אוטומטית לדשבורד שלכם.',
  },
  {
    q: 'לאילו סוגי אירועים זה מתאים?',
    a: 'לכל אירוע — חתונה, בר/בת מצווה, ברית, אירוע עסקי, יום הולדת ועוד. לכל סוג אירוע יש מסלול מותאם שמנהל את כל התהליך.',
  },
  {
    q: 'איך מתאימים לי חבילה?',
    a: 'כל אירוע מקבל שיחת ייעוץ אישית — מספרים לנו על סוג האירוע, הגודל והצרכים, ואנחנו בונים יחד את החבילה שמתאימה בדיוק לכם. השאירו פרטים ונחזור אליכם, בלי התחייבות.',
  },
  {
    q: 'מה לגבי אבטחה ופרטיות הנתונים?',
    a: 'רשימות האורחים והנתונים שלכם מאוחסנים בצורה מאובטחת ולא משותפים עם אף גורם. אתם הבעלים של המידע, ויכולים לייצא או למחוק אותו בכל רגע.',
  },
  {
    q: 'אפשר לעצב הזמנה משלי?',
    a: 'בהחלט. בחרו מתוך קטלוג עיצובים מקצועיים, או קבלו עיצוב אישי לחלוטין כולל וידאו, מוזיקה וצבעים מותאמים לסגנון האירוע שלכם.',
  },
];

function FAQItem({ item, isOpen, onToggle }: { item: QA; isOpen: boolean; onToggle: () => void }) {
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

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-mesh-light px-4 py-24" dir="rtl" id="faq">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-magenta/10 px-4 py-1.5 text-sm font-bold text-magenta">
            שאלות נפוצות
          </span>
          <h2 className="mt-4 text-4xl font-black text-brand-navy md:text-5xl">
            יש לכם <span className="text-gradient">שאלה?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xl text-slate-600">
            התשובות לשאלות שהכי חשוב לדעת לפני שמתחילים
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
