'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabaseClient';
import sanitizeInput from '@/utils/sanitize';

export default function AdminSetup() {
  const router = useRouter();
  console.log('🔍 [page.tsx] const router = useRouter();');
  const supabase = createClient();
  console.log('🔍 [page.tsx] const supabase = createClient();');
  const [email, setEmail] = useState('');
  console.log('🔍 [page.tsx] const [email, setEmail] = useState('');');
  const [password, setPassword] = useState('');
  console.log('🔍 [page.tsx] const [password, setPassword] = useState('');');
  const [error, setError] = useState('');
  console.log('🔍 [page.tsx] const [error, setError] = useState('');');

  const handleSubmit = async (e) => {
  console.log('🔍 [page.tsx] Entering function: const handleSubmit = async ');
    e.preventDefault();
    const cleanEmail = sanitizeInput(email);
    console.log('🔍 [page.tsx] const cleanEmail = sanitizeInput(email);');
    const cleanPassword = sanitizeInput(password);
    console.log('🔍 [page.tsx] const cleanPassword = sanitizeInput(password);');

    const { user, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: cleanPassword,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/admin/tools');
    }
  };

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Admin Setup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 border rounded" />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Create Admin</button>
      </form>
    </main>
  );
}
