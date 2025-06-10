'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

export function useOperatorAuth() {
console.log('🔍 [useOperatorAuth.ts] Entering function: export function useOperatorAuth');
  const [session, setSession] = useState<Session | null>(null);
  console.log('🔍 [useOperatorAuth.ts] const [session, setSession] = useState<Session | null>(null);');
  const [loading, setLoading] = useState(true);
  console.log('🔍 [useOperatorAuth.ts] const [loading, setLoading] = useState(true);');

  useEffect(() => {
    async function fetchSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      console.log('🔍 [useOperatorAuth.ts] } = await supabase.auth.getSession();');
      if (error) {
        console.error('Error fetching session:', error);
      } else if (session?.user?.user_metadata?.role === 'operator') {
        setSession(session);
      }
      setLoading(false);
    }

    fetchSession();
  }, []);

  return { session, loading };
}
