import { Check } from 'lucide-react';
import PhoneMockup from './PhoneMockup';
import DemoModal from './DemoModal';
import { whatsappHref } from '@/lib/site';

const trustSignals = [
  'שיחת ייעוץ חינם, בלי התחייבות',
  'שליחה בוואטסאפ, בלי אפליקציה',
  'שיחות AI בעברית למי שלא ענה',
  'תמיכה ופיתוח בישראל',
];

export default function HeroSection() {
  return (
    <section className="bg-white px-4 pt-20 pb-24" dir="rtl">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        {/* text column */}
        <div className="space-y-7 text-center lg:text-right">
          <h1 className="text-4xl font-extrabold leading-tight text-brand-navy md:text-5xl">
            הטכנולוגיה שמנהלת את האירוע שלך
          </h1>

          <p className="mx-auto max-w-lg text-lg leading-relaxed text-gray-500 lg:mx-0">
            הזמנות דיגיטליות, אישורי הגעה בוואטסאפ ובשיחות AI, וניהול אורחים —
            במקום אחד.
          </p>

          <div className="flex flex-col justify-center gap-3 pt-1 sm:flex-row lg:justify-start">
            <a href="#contact" className="btn-primary">
              קביעת שיחת ייעוץ
            </a>
            <DemoModal className="btn-ghost text-brand-navy hover:bg-brand-navy hover:text-white" />
          </div>

          <ul className="grid gap-x-6 gap-y-2 pt-2 text-right sm:grid-cols-2">
            {trustSignals.map((label) => (
              <li
                key={label}
                className="flex items-center justify-center gap-2 text-sm text-gray-600 lg:justify-start"
              >
                <Check className="h-4 w-4 flex-shrink-0 text-brand-blue" strokeWidth={2.5} />
                {label}
              </li>
            ))}
          </ul>

          <div className="pt-1 text-center lg:text-right">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-blue underline-offset-4 transition hover:underline"
            >
              או דברו איתנו בוואטסאפ ←
            </a>
          </div>
        </div>

        {/* phone column */}
        <div className="flex justify-center lg:justify-start">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
