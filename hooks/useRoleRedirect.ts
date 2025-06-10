import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

/**
 * Redirects user to the correct dashboard based on their Supabase role metadata.
 * - operator → /operator
 * - client   → /client
 * - admin    → /admin
 * Redirects to /login if not authenticated.
 */
export function useRoleRedirect() {
  const router = useRouter();
  const { user, loading } = useUser();
  console.log('🔍 [useRoleRedirect.ts] const { user, loading } = useUser();');

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role === 'operator') {
      router.replace('/operator');
    } else if (user.role === 'client') {
      router.replace('/client');
    } else if (user.role === 'admin') {
      router.replace('/admin');
    }
  }, [user, loading, router]);
}
