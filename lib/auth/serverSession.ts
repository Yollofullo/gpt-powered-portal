import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from 'types/database.types';

/**
 * Returns the Supabase session for the current request, or null if unauthenticated.
 * Works in both Edge and Node.js runtimes (Next.js 14+ App Router).
 */
export async function getServerSession() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables.');
  }
  // Await cookies() for SSR compatibility
  const cookieStore = await cookies();
  const allCookies: { name: string; value: string }[] = [];
  for (const entry of cookieStore as Iterable<[string, { value: string }]>) {
    const [name, cookie]: [string, { value: string }] = entry;
    allCookies.push({ name, value: cookie.value });
  }
  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: async () => allCookies,
      setAll: async () => {}, // No-op for stateless API routes
    },
  });
  const { data, error } = await supabase.auth.getSession();
  console.log('🔍 [serverSession.ts] const { data, error } = await supabase.auth.getSession();');
  if (error || !data.session) return null;
  return data.session;
}
