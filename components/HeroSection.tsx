import PhoneMockup from './PhoneMockup';
import DemoModal from './DemoModal';
import { whatsappHref } from '@/lib/site';

interface TrustSignal {
  icon: string;
  label: string;
}

const trustSignals: TrustSignal[] = [
  { icon: '🚀', label: 'התחלה בחינם — בלי כרטיס אשראי' },
  { icon: '💬', label: 'שליחה בוואטסאפ — בלי הורדת אפליקציה' },
  { icon: '🤖', label: 'AI בעברית טבעית למי שלא ענה' },
  { icon: '🇮🇱', label: 'תמיכה ישראלית, פיתוח מקומי' },
];

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-mesh px-4 pt-16 pb-24"
      dir="rtl"
    >
      {/* animated background blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-grape/40 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute top-40 -left-24 h-96 w-96 rounded-full bg-brand-teal/30 blur-3xl animate-blob animation-delay-300" />
      <div className="pointer-events-none absolute bottom-0 right-1/3 h-80 w-80 rounded-full bg-magenta/30 blur-3xl animate-blob animation-delay-500" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* text column */}
        <div className="space-y-7 text-center lg:text-right">
          <div className="inline-flex animate-fade-in-up items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/20">
            <span className="h-2 w-2 rounded-full bg-brand-teal animate-pulse" />
            האוטומציה החכמה היחידה בישראל
          </div>

          <h1 className="animate-fade-in-up animation-delay-100 text-5xl font-black leading-tight text-white md:text-6xl">
            הטכנולוגיה ש<span className="text-gradient-warm">מנהלת</span>
            <br />
            את האירוע שלך
          </h1>

          <p className="animate-fade-in-up animation-delay-200 mx-auto max-w-xl text-lg font-medium leading-relaxed text-slate-200 lg:mx-0">
            הזמנות דיגיטליות, אישורי הגעה אוטומטיים בוואטסאפ ובשיחות קוליות
            חכמות, וניהול אורחים מלא — הכל ממקום אחד. והמשתלם ביותר בשוק.
          </p>

          <div className="flex animate-fade-in-up animation-delay-300 flex-col justify-center gap-4 pt-2 sm:flex-row lg:justify-start">
            <a href="#contact" className="btn-primary">התחילו בחינם</a>
            <DemoModal />
          </div>

          <div className="animate-fade-in-up animation-delay-500 flex items-center justify-center gap-2 pt-1 lg:justify-start">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-slate-300 underline-offset-4 transition hover:text-white hover:underline"
            >
              או דברו איתנו ישירות בוואטסאפ ←
            </a>
          </div>
        </div>

        {/* phone column */}
        <div className="animate-fade-in animation-delay-200 flex justify-center lg:justify-start">
          <PhoneMockup />
        </div>
      </div>

      {/* trust signals band */}
      <div className="relative mx-auto mt-20 max-w-6xl">
        <div className="grid grid-cols-2 gap-4 rounded-3xl glass p-6 md:grid-cols-4 md:gap-6 md:p-8">
          {trustSignals.map((signal, i) => (
            <div
              key={i}
              className="animate-fade-in-up text-center"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="text-4xl md:text-5xl" aria-hidden="true">
                {signal.icon}
              </div>
              <p className="mt-3 text-sm font-bold leading-snug text-white">
                {signal.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
