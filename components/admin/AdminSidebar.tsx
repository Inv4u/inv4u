'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SignOutButton from '@/components/SignOutButton';

const LINKS = [
  { href: '/admin', label: 'בית', icon: '🏠', exact: true },
  { href: '/admin/users', label: 'משתמשים', icon: '👥', exact: false },
  { href: '/admin/events', label: 'אירועים', icon: '🎉', exact: false },
  { href: '/admin/notifications', label: 'התראות', icon: '🔔', exact: false },
  { href: '/admin/settings', label: 'הגדרות', icon: '⚙️', exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="border-slate-200 bg-white md:sticky md:top-0 md:flex md:h-screen md:w-60 md:flex-col md:border-l">
      <div className="hidden px-6 py-5 md:block">
        <Link href="/admin" className="text-xl font-black text-brand-navy">
          INV<span className="text-brand-blue">4</span>U
        </Link>
        <span className="mt-1 block text-xs font-bold uppercase tracking-wide text-slate-400">
          ניהול
        </span>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 py-2 md:flex-col md:gap-1 md:px-3 md:py-2">
        {LINKS.map((l) => {
          const active = isActive(l.href, l.exact);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex flex-shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                active
                  ? 'bg-brand-blue text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{l.icon}</span>
              <span>{l.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden p-4 md:block">
        <SignOutButton className="w-full rounded-full border-2 border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100" />
      </div>
    </aside>
  );
}
