import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@/types/types';

export function useUser(): { user: User | null; loading: boolean } {
  const [user, setUser] = useState<User | null>(null);
  console.log('🔍 [useUser.ts] const [user, setUser] = useState<User | null>(null);');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function getSession() {
    console.log('🔍 [useUser.ts] async function getSession() {');
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔍 [useUser.ts] const { data: { session } } = await supabase.auth.getSession();');
      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }
      const { user } = session;
      console.log('🔍 [useUser.ts] const { user } = session;');
      // You may want to fetch the role from your DB or JWT
      // For demo, assume role is in user.user_metadata.role
      const role = user.user_metadata?.role || 'client';
      console.log('🔍 [useUser.ts] const role = user.user_metadata?.role || 'client';');
      if (!ignore) {
        setUser({
          id: user.id,
          email: user.email || '',
          role,
        });
        setLoading(false);
      }
    }
    getSession();
    console.log('🔍 [useUser.ts] getSession();');
    return () => { ignore = true; };
  }, []);

  return { user, loading };
}
