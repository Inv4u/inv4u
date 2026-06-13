import Reveal from './Reveal';

interface MidPageCTAProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

/**
 * Lightweight mid-page CTA band that breaks up the scroll between feature
 * blocks. Deliberately simple and calm — not a hard sell.
 */
export default function MidPageCTA({
  title = 'מוכנים להתחיל?',
  subtitle = 'השאירו פרטים ונבנה יחד את ההזמנה לאירוע שלכם.',
  buttonText = 'בואו נתחיל',
}: MidPageCTAProps) {
  return (
    <section className="bg-white px-4 py-14" dir="rtl">
      <Reveal className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-slate-100 bg-[#F4F5F7] px-8 py-9 text-center shadow-sm sm:flex-row sm:justify-between sm:text-right">
          <div>
            <h3 className="text-2xl font-black text-brand-navy md:text-3xl">
              {title}
            </h3>
            <p className="mt-2 text-base text-slate-600 md:text-lg">{subtitle}</p>
          </div>
          <a href="/#contact" className="btn-primary flex-shrink-0">
            {buttonText}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
