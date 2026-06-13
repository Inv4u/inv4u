'use client';

import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';

export default function SignOutButton({
  className = '',
}: {
  className?: string;
}) {
  const router = useRouter();

  const handle = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handle}
      className={
        className ||
        'rounded-full border-2 border-slate-300 px-5 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100'
      }
    >
      התנתקות
    </button>
  );
}
