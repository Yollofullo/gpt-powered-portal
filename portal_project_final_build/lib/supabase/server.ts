import { createServerClient } from '@supabase/ssr';
import { cookies as nextCookies } from 'next/headers';
import type { Database } from '@/types/database.types';

export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables.');
  }
  const cookieStorePromise = nextCookies();
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: async () => {
        const cookieStore = await cookieStorePromise;
        return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
      },
      setAll: async () => {}, // No-op for stateless API routes
    },
  });
}
