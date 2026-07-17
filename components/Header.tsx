'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { whatsappHref } from '@/lib/site';

const navLinks = [
  { href: '/how-it-works', label: 'איך זה עובד' },
  { href: '/#features', label: 'יכולות' },
  { href: '/#faq', label: 'שאלות' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white" dir="rtl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="text-2xl font-extrabold text-brand-navy">
          INV<span className="text-brand-blue">4</span>U
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-gray-600 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-brand-navy">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0a1538]"
          >
            דברו איתנו
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-brand-navy md:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <nav className="border-t border-gray-100 px-5 py-2 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-base font-medium text-gray-700 transition hover:text-brand-navy"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
