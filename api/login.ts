import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { checkUserRole } from '@/lib/checkUserRole';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: async () => {
            const cookieStore = await cookies();
            return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
          },
          setAll: async () => {},
        },
      }
    );
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log('🔍 [login.ts] const { data, error } = await supabase.auth.signInWithPassword({ email, password });');
    if (error || !data.session) {
      return NextResponse.json({ error: error?.message || 'Invalid credentials.' }, { status: 401 });
    }
    // Set the session cookie (handled by Supabase client)
    // Now check the user's role and redirect
    const { role, redirect } = await checkUserRole();
    console.log('🔍 [login.ts] const { role, redirect } = await checkUserRole();');
    if (redirect) {
      return NextResponse.json({ redirect });
    }
    if (role === 'operator') {
      return NextResponse.json({ redirect: '/dashboard/operator' });
    }
    if (role === 'client') {
      return NextResponse.json({ redirect: '/dashboard/client' });
    }
    if (role === 'admin') {
      return NextResponse.json({ redirect: '/dashboard/admin' });
    }
    return NextResponse.json({ error: 'No role assigned.' }, { status: 403 });
  } catch (err) {
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}
