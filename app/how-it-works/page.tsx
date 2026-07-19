import type { Metadata } from 'next';
import Header from '@/components/Header';
import HowItWorks from '@/components/HowItWorks';
import ProcessFAQ from '@/components/ProcessFAQ';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { whatsappHref } from '@/lib/site';

export const metadata: Metadata = {
  title: 'איך זה עובד | Maorly — מההזמנה ועד האירוע המושלם',
  description:
    'התהליך ב-Maorly: הזמנות בוואטסאפ, אישורי הגעה אוטומטיים, שיחות AI בעברית וניהול אורחים מלוח בקרה אחד.',
};

export default function HowItWorksPage() {
  return (
    <main className="w-full">
      <Header />

      {/* Page hero — clean white, tight */}
      <section className="bg-white px-5 pb-10 pt-14 text-center md:pb-14 md:pt-20" dir="rtl">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-extrabold leading-tight text-brand-navy md:text-5xl">
            איך <span dir="ltr">Maorly</span> עובד
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-500">
            חמישה שלבים. אנחנו מנהלים את כולם — מההזמנה ועד רשימת אורחים סופית ומדויקת.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-7"
          >
            דברו איתנו בוואטסאפ
          </a>
        </div>
      </section>

      {/* Expanded 5-step story */}
      <HowItWorks expanded />

      {/* Process FAQs */}
      <ProcessFAQ />

      {/* Closing CTA */}
      <section className="bg-white px-5 pb-16 md:pb-24" dir="rtl">
        <div className="mx-auto max-w-4xl rounded-2xl bg-brand-navy px-6 py-12 text-center md:px-12 md:py-14">
          <h2 className="text-2xl font-extrabold leading-tight text-white md:text-3xl">
            מוכנים לראות את זה על האירוע שלכם?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-slate-300">
            שיחת ייעוץ קצרה, בלי התחייבות. נחזור אליכם תוך 3 שעות.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-3 font-semibold text-brand-navy transition-colors hover:bg-gray-100"
          >
            דברו איתנו בוואטסאפ
          </a>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
