'use client';

import React from 'react'; // Add React import for JSX
import { supabase } from '@/lib/supabaseClient';

export default function OperatorLoginPage() {
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
    console.log('🔍 [page.tsx] const { error } = await supabase.auth.signInWithOAuth({');
      provider: 'github',
    });
    if (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={handleSignIn}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Operator Login with GitHub
      </button>
    </div>
  );
}
