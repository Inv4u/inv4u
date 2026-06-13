import type { Metadata } from 'next';
import Link from 'next/link';
import { site, telHref, whatsappHref } from '@/lib/site';

export const metadata: Metadata = {
  title: 'החשבון ממתין לאישור | INV4U',
};

export default function PendingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-mesh px-4 py-16" dir="rtl">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl md:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
          ⏳
        </div>
        <h1 className="mt-6 text-2xl font-black text-brand-navy">
          החשבון שלך ממתין לאישור
        </h1>
        <p className="mt-3 leading-relaxed text-slate-600">
          תודה על ההרשמה! כדי לשמור על איכות השירות, כל חשבון חדש עובר אישור ידני.
          נאשר את החשבון שלך בהקדם ונעדכן אותך — בדרך כלל תוך מספר שעות.
        </p>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-bold text-slate-700">יש לכם שאלה בינתיים?</p>
          <div className="mt-3 flex flex-col gap-2">
            <a href={telHref} dir="ltr" className="font-bold text-brand-blue hover:underline">
              📞 {site.phoneDisplay}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-600 hover:underline"
            >
              💬 דברו איתנו בוואטסאפ
            </a>
          </div>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block font-bold text-slate-400 hover:text-slate-600"
        >
          ← חזרה לדף הבית
        </Link>
      </div>
    </main>
  );
}
