import type { Metadata } from 'next';
import Link from 'next/link';
import { KeyRound, MessageSquare, Phone } from 'lucide-react';
import { site, telHref, whatsappHref } from '@/lib/site';

export const metadata: Metadata = {
  title: 'שחזור סיסמה | inv4u',
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-16" dir="rtl">
      <div className="w-full max-w-sm text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200">
          <KeyRound className="h-5 w-5 text-brand-navy" strokeWidth={1.75} />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold text-brand-navy">שכחתם סיסמה?</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          שחזור אוטומטי בקרוב. בינתיים שלחו הודעה או חייגו ונאפס לכם את הסיסמה.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-navy px-5 py-2.5 font-semibold text-white transition-colors hover:bg-[#0a1538]"
          >
            <MessageSquare className="h-4 w-4" strokeWidth={2} />
            שחזור בוואטסאפ
          </a>
          <a
            href={telHref}
            dir="ltr"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-brand-navy transition-colors hover:bg-gray-50"
          >
            <Phone className="h-4 w-4" strokeWidth={2} />
            {site.phoneDisplay}
          </a>
        </div>

        <Link
          href="/login"
          className="mt-8 inline-block text-sm font-medium text-gray-400 hover:text-gray-600"
        >
          ← חזרה להתחברות
        </Link>
      </div>
    </main>
  );
}
