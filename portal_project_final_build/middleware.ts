import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function middleware(req: NextRequest) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log('🔍 [middleware.ts] } = await supabase.auth.getSession();');

  const url = req.nextUrl.clone();
  console.log('🔍 [middleware.ts] const url = req.nextUrl.clone();');

  // Redirect to login if no session
  if (!session) {
    url.pathname = '/login';
    console.log("🔍 [middleware.ts] url.pathname = '/login';");
    return NextResponse.redirect(url);
  }

  const userRole = session.user?.user_metadata?.role;
  console.log('🔍 [middleware.ts] const userRole = session.user?.user_metadata?.role;');

  // Redirect if role is missing
  if (!userRole) {
    url.pathname = '/login';
    console.log("🔍 [middleware.ts] url.pathname = '/login';");
    return NextResponse.redirect(url);
  }

  const routeRoles = [
    { path: '/admin', role: 'admin' },
    { path: '/portal', role: 'client' },
    { path: '/operator', role: 'operator' },
    { path: '/client', role: 'client' },
  ];

  for (const { path, role } of routeRoles) {
    if (req.nextUrl.pathname.startsWith(path) && userRole !== role) {
      url.pathname = '/access-denied';
      console.log('🔍 [middleware.ts] url.pathname = '/access-denied';');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*', '/operator/:path*', '/client/:path*'],
};
