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
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white" dir="rtl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
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

        <a
          href="/#contact"
          className="rounded-lg bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0a1538]"
        >
          קביעת שיחת ייעוץ
        </a>
      </div>
    </header>
  );
}
