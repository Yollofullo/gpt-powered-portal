
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';

type UserRole = 'admin' | 'client' | null;
console.log('🔍 [UserRoleContext.tsx] type UserRole = 'admin' | 'client' | null;');

interface UserRoleContextType {
  role: UserRole;
  loading: boolean;
  error: string | null;
}

const UserRoleContext = createContext<UserRoleContextType>({
  role: null,
  loading: true,
  error: null,
});

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>(null);
  console.log('🔍 [UserRoleContext.tsx] const [role, setRole] = useState<UserRole>(null);');
  const [loading, setLoading] = useState(true);
  console.log('🔍 [UserRoleContext.tsx] const [loading, setLoading] = useState(true);');
  const [error, setError] = useState<string | null>(null);
  console.log('🔍 [UserRoleContext.tsx] const [error, setError] = useState<string | null>(null);');

  useEffect(() => {
    const fetchUserRole = async () => {
    console.log('🔍 [UserRoleContext.tsx] Entering function: const fetchUserRole = async ');
      setLoading(true);
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      console.log('🔍 [UserRoleContext.tsx] } = await supabase.auth.getSession();');

      if (sessionError || !session?.user) {
        setError('No session found');
        setLoading(false);
        return;
      }

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        setError('Failed to fetch role');
        setLoading(false);
        return;
      }

      setRole(data?.role || null);
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  return (
    
  console.log('🔍 [UserRoleContext] role value before providing:', role);
  <UserRoleContext.Provider value={{ role, loading, error }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => useContext(UserRoleContext);
console.log('🔍 [UserRoleContext.tsx] export const useUserRole = () => useContext(UserRoleContext);');
