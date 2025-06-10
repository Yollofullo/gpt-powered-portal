'use client';

import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useClientAuth() {
console.log('🔍 [useClientAuth.ts] Entering function: export function useClientAuth');
  const [session, setSession] = useState<Session | null>(null);
  console.log('🔍 [useClientAuth.ts] const [session, setSession] = useState<Session | null>(null);');
  const [loading, setLoading] = useState(true);
  console.log('🔍 [useClientAuth.ts] const [loading, setLoading] = useState(true);');

  useEffect(() => {
    async function fetchSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      console.log('🔍 [useClientAuth.ts] } = await supabase.auth.getSession();');
      if (error) {
        console.error('Error fetching session:', error);
      } else if (session?.user?.user_metadata?.role === 'client') {
        setSession(session);
      }
      setLoading(false);
    }

    fetchSession();
  }, []);

  return { session, loading };
}
