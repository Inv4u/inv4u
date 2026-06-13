import Link from 'next/link';
import Reveal from './Reveal';

/**
 * Homepage teaser that replaces the full "how it works" section — a single
 * elegant CTA leading to the dedicated /how-it-works page.
 */
export default function HowItWorksCTA() {
  return (
    <section className="bg-white px-4 py-20 md:py-24" dir="rtl">
      <Reveal className="mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full bg-brand-blue/10 px-4 py-1.5 text-sm font-bold text-brand-blue">
          איך זה עובד
        </span>
        <h2 className="mt-4 text-3xl font-black leading-tight text-brand-navy md:text-4xl">
          מהזמנה ראשונה ועד האירוע המושלם
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
          חמישה שלבים פשוטים — יצירה, שליחה בוואטסאפ, אישורי הגעה, מעקב AI וניהול
          מלא מלוח בקרה אחד. רוצים לראות בדיוק איך כל שלב עובד?
        </p>

        {/* compact step pills */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-sm font-bold text-slate-500">
          {['יצירה', 'שליחה', 'אישורים', 'מעקב AI', 'אירוע מושלם'].map(
            (label, i) => (
              <span key={label} className="flex items-center gap-2">
                {i > 0 && <span className="text-brand-blue/40">←</span>}
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  {label}
                </span>
              </span>
            )
          )}
        </div>

        <Link
          href="/how-it-works"
          className="btn-primary mt-9 group"
        >
          איך זה עובד? לחצו לראות את התהליך המלא
          <span className="transition-transform group-hover:-translate-x-1">←</span>
        </Link>
      </Reveal>
    </section>
  );
}
