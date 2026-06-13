import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/database.types';

/**
 * Refreshes the Supabase session cookie and enforces route protection:
 *   - /admin/*      → must be logged in AND role = 'admin'
 *   - /dashboard/*  → must be logged in AND approved = true (else /pending)
 * Public routes pass through untouched.
 *
 * DB lookups are wrapped defensively: if the profiles table isn't there yet
 * (migrations not applied), protected routes redirect rather than 500.
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
  const needsApproved = path.startsWith('/dashboard');

  if (!needsAdmin && !needsApproved) return response;

  // Not logged in → send to login with a return path.
  if (!user) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = '/login';
    redirect.searchParams.set('next', path);
    return NextResponse.redirect(redirect);
  }

  // Look up role/approval. Defensive: any error → treat as unauthorized.
  let role: string | null = null;
  let approved = false;
  try {
    const { data } = await supabase
      .from('profiles')
      .select('role, approved')
      .eq('id', user.id)
      .maybeSingle();
    role = (data as { role?: string } | null)?.role ?? null;
    approved = (data as { approved?: boolean } | null)?.approved === true;
  } catch {
    // profiles table missing or query failed
  }

  if (needsAdmin && role !== 'admin') {
    const redirect = request.nextUrl.clone();
    redirect.pathname = role ? '/dashboard' : '/login';
    return NextResponse.redirect(redirect);
  }

  if (needsApproved && !approved) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = '/pending';
    return NextResponse.redirect(redirect);
  }

  return response;
}
