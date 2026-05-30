import Reveal from './Reveal';

/** Early-stage CTA banner inviting first customers. */
export default function JoinBanner() {
  return (
    <section className="bg-white px-4 py-16" dir="rtl">
      <Reveal className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl bg-brand-navy px-8 py-12 text-center shadow-2xl md:px-12">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-grape/40 blur-3xl animate-blob" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand-teal/30 blur-3xl animate-blob animation-delay-300" />

          <div className="relative">
            <h2 className="text-3xl font-black leading-tight text-white md:text-4xl">
              היו מהראשונים{' '}
              <span className="text-gradient-warm">לנהל אירוע</span>
              <br className="hidden sm:block" /> בלי שיחות טלפון
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
              השאירו פרטים ונחזור אליכם תוך 3 שעות עם כל המידע על איך זה עובד
            </p>
            <a href="#contact" className="btn-primary mt-8">
              אני רוצה להצטרף
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
