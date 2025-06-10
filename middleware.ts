import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getRedirectPath } from './lib/authRedirect';

export async function middleware(req: NextRequest) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const url = req.nextUrl.clone();
  const redirectPath = getRedirectPath({ session, pathname: req.nextUrl.pathname });
  if (redirectPath) {
    url.pathname = redirectPath;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*', '/operator/:path*', '/client/:path*'],
};
