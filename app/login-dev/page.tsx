'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { create } from 'zustand';

// Zustand store for dev role simulation
type DevAuthState = {
  role: 'admin' | 'operator' | 'client' | null;
  setRole: (role: 'admin' | 'operator' | 'client') => void;
  console.log('🔍 [page.tsx] setRole: (role: 'admin' | 'operator' | 'client') => void;');
};

export const useDevAuthStore = create<DevAuthState>((set) => ({
  role: null,
  setRole: (role) => set({ role }),
}));

const roleToDashboard: Record<string, string> = {
  admin: '/dashboard/admin',
  operator: '/dashboard/operator',
  client: '/dashboard/client',
};

export default function LoginDevPage() {
  const router = useRouter();
  const setRole = useDevAuthStore((s) => s.setRole);

  const handleLogin = (role: 'admin' | 'operator' | 'client') => {
    setRole(role);
    router.push(roleToDashboard[role]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md flex flex-col items-center">
        <div className="w-full mb-6">
          <div className="bg-red-600 text-white text-center py-2 rounded mb-4 font-bold">
            THIS IS DEV ONLY
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-6">Simulate Login (DEV)</h1>
        <div className="flex flex-col gap-4 w-full">
          <button
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
            onClick={() => handleLogin('admin')}
          >
            Login as Admin
          </button>
          <button
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold"
            onClick={() => handleLogin('operator')}
          >
            Login as Operator
          </button>
          <button
            className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 font-semibold"
            onClick={() => handleLogin('client')}
          >
            Login as Client
          </button>
        </div>
      </div>
    </div>
  );
}
