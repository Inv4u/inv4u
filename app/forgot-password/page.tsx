import type { Metadata } from 'next';
import Link from 'next/link';
import { site, telHref, whatsappHref } from '@/lib/site';

export const metadata: Metadata = {
  title: 'שחזור סיסמה | inv4u',
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-mesh px-4 py-16" dir="rtl">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl md:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/10 text-3xl">
          🔑
        </div>
        <h1 className="mt-6 text-2xl font-black text-brand-navy">שכחתם סיסמה?</h1>
        <p className="mt-3 leading-relaxed text-slate-600">
          שחזור סיסמה אוטומטי יתווסף בקרוב. בינתיים — שלחו לנו הודעה או חייגו ונאפס
          לכם את הסיסמה תוך דקות.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-emerald-500 px-5 py-3 font-bold text-white transition hover:bg-emerald-600"
          >
            💬 שחזור בוואטסאפ
          </a>
          <a
            href={telHref}
            dir="ltr"
            className="rounded-full border-2 border-slate-200 px-5 py-3 font-bold text-brand-blue transition hover:bg-slate-50"
          >
            📞 {site.phoneDisplay}
          </a>
        </div>

        <Link
          href="/login"
          className="mt-8 inline-block font-bold text-slate-400 hover:text-slate-600"
        >
          ← חזרה להתחברות
        </Link>
      </div>
    </main>
  );
}
