import type { Metadata } from 'next';
import Header from '@/components/Header';
import HowItWorks from '@/components/HowItWorks';
import ProcessFAQ from '@/components/ProcessFAQ';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export const metadata: Metadata = {
  title: 'איך זה עובד | INV4U — מההזמנה ועד האירוע המושלם',
  description:
    'הסבר מלא על התהליך ב-INV4U: יצירת אירוע, שליחת הזמנות בוואטסאפ, אישורי הגעה אוטומטיים, שיחות AI בעברית וניהול אורחים מלוח בקרה אחד.',
};

export default function HowItWorksPage() {
  return (
    <main className="w-full">
      <Header />

      {/* Page hero */}
      <section className="relative overflow-hidden bg-mesh px-4 pb-20 pt-20 text-center" dir="rtl">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-grape/40 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-0 -left-24 h-80 w-80 rounded-full bg-brand-teal/30 blur-3xl animate-blob animation-delay-300" />

        <div className="relative mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/20">
            <span className="h-2 w-2 rounded-full bg-brand-teal animate-pulse" />
            המדריך המלא
          </span>
          <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-6xl">
            איך <span className="text-gradient-warm">INV4U</span> עובד
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-relaxed text-slate-200 md:text-xl">
            חמישה שלבים פשוטים שלוקחים אתכם מרשימת מוזמנים מבולגנת לאירוע מאורגן
            לחלוטין — בלי טלפונים, בלי אקסלים ובלי כאב ראש. הנה כל התהליך, צעד אחר צעד.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="/#contact" className="btn-primary">
              צרו את ההזמנה שלכם
            </a>
            <a
              href="#how-it-works"
              className="font-bold text-slate-300 underline-offset-4 transition hover:text-white hover:underline"
            >
              גללו לתהליך המלא ↓
            </a>
          </div>
        </div>
      </section>

      {/* Expanded 5-step story */}
      <HowItWorks expanded />

      {/* Process FAQs */}
      <ProcessFAQ />

      {/* Closing CTA */}
      <section className="bg-white px-4 pb-24" dir="rtl">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-brand-navy px-8 py-14 text-center shadow-2xl md:px-12">
          <h2 className="text-3xl font-black leading-tight text-white md:text-4xl">
            מוכנים לראות את זה עובד על האירוע שלכם?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
            השאירו פרטים ונחזור אליכם תוך 3 שעות עם הצעה מותאמת אישית.
          </p>
          <a href="/#contact" className="btn-primary mt-8">
            התחילו עכשיו
          </a>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
