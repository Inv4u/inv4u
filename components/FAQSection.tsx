'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface QA {
  q: string;
  a: string;
}

const faqs: QA[] = [
  {
    q: 'האורחים צריכים להתקין אפליקציה?',
    a: 'לא. הם מקבלים הזמנה בוואטסאפ ומאשרים בלחיצה — בלי הורדות ובלי הרשמה.',
  },
  {
    q: 'איך עובדות שיחות ה-AI?',
    a: 'מי שלא הגיב מקבל שיחה בעברית טבעית שמאשרת הגעה. כל שיחה מתומללת לדשבורד שלכם.',
  },
  {
    q: 'איך מתאימים לי חבילה?',
    a: 'בשיחת ייעוץ קצרה. מספרים לנו על האירוע, ואנחנו בונים חבילה שמתאימה — בלי התחייבות.',
  },
  {
    q: 'מה עם פרטיות הנתונים?',
    a: 'רשימת האורחים שלכם שלכם בלבד, מאוחסנת מאובטח ולא משותפת. אפשר לייצא או למחוק בכל רגע.',
  },
];

function FAQItem({ item, isOpen, onToggle }: { item: QA; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 p-5 text-right transition hover:bg-gray-50"
      >
        <span className="text-base font-bold text-brand-navy md:text-lg">{item.q}</span>
        <Plus
          className={`h-5 w-5 flex-shrink-0 text-brand-blue transition-transform duration-300 ${
            isOpen ? 'rotate-45' : ''
          }`}
          strokeWidth={2.5}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-base leading-relaxed text-gray-600">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-white px-5 py-16 md:py-24" dir="rtl" id="faq">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-3xl font-extrabold text-brand-navy md:text-4xl">שאלות נפוצות</h2>

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
