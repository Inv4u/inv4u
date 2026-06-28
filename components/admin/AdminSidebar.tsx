'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Calendar, Bell, Settings, type LucideIcon } from 'lucide-react';
import SignOutButton from '@/components/SignOutButton';

const LINKS: { href: string; label: string; icon: LucideIcon; exact: boolean }[] = [
  { href: '/admin', label: 'בית', icon: Home, exact: true },
  { href: '/admin/users', label: 'משתמשים', icon: Users, exact: false },
  { href: '/admin/events', label: 'אירועים', icon: Calendar, exact: false },
  { href: '/admin/notifications', label: 'התראות', icon: Bell, exact: false },
  { href: '/admin/settings', label: 'הגדרות', icon: Settings, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="border-gray-200 bg-white md:sticky md:top-0 md:flex md:h-screen md:w-60 md:flex-col md:border-l">
      <div className="hidden px-6 py-5 md:block">
        <Link href="/admin" className="text-xl font-extrabold text-brand-navy">
          INV<span className="text-brand-blue">4</span>U
        </Link>
        <span className="mt-1 block text-xs font-medium uppercase tracking-wide text-gray-400">
          ניהול
        </span>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 py-2 md:flex-col">
        {LINKS.map((l) => {
          const active = isActive(l.href, l.exact);
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex flex-shrink-0 items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-navy text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              <span>{l.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden p-4 md:block">
        <SignOutButton className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50" />
      </div>
    </aside>
  );
}
