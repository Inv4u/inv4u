import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/database.types';

/**
 * Refreshes the Supabase session cookie and enforces route protection:
 *   - /dashboard/*  → must be logged in (any account; features gate inside)
 *   - /admin/*      → must be logged in AND role = 'admin'
 * Public routes pass through untouched.
 *
 * There is no whole-account approval gate: a logged-in user always reaches the
 * dashboard (every feature is locked there until Maor unlocks it). DB lookups
 * are wrapped defensively so a missing `users` table (migrations not applied
 * yet) redirects rather than 500s.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // If Supabase isn't configured, don't block anything.
  if (!url || !anonKey) return response;

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const needsAdmin = path.startsWith('/admin');
  const needsAuth = path.startsWith('/dashboard');

  if (!needsAdmin && !needsAuth) return response;

  // Not logged in → send to login with a return path.
  if (!user) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = '/login';
    redirect.searchParams.set('next', path);
    return NextResponse.redirect(redirect);
  }

  // /dashboard: being logged in is enough.
  if (needsAuth && !needsAdmin) return response;

  // /admin: require role = 'admin'. Defensive: any error → treat as non-admin.
  let role: string | null = null;
  try {
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    role = (data as { role?: string } | null)?.role ?? null;
  } catch {
    // users table missing or query failed
  }

  if (role !== 'admin') {
    const redirect = request.nextUrl.clone();
    redirect.pathname = '/dashboard';
    return NextResponse.redirect(redirect);
  }

  return response;
}
