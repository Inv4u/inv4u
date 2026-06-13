import Link from 'next/link';

const navLinks = [
  { href: '/how-it-works', label: 'איך זה עובד' },
  { href: '/#features', label: 'יכולות' },
  { href: '/#roadmap', label: 'מסלולים' },
  { href: '/#consultation', label: 'ייעוץ' },
  { href: '/#faq', label: 'שאלות' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 glass-dark" dir="rtl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="text-2xl font-black text-white">
          INV<span className="text-gradient-warm">4</span>U
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-bold text-slate-200 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="/#contact"
          className="rounded-full bg-gradient-to-r from-brand-blue to-grape px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-grape/30 transition hover:-translate-y-0.5"
        >
          קבעו שיחת ייעוץ
        </a>
      </div>
    </header>
  );
}
