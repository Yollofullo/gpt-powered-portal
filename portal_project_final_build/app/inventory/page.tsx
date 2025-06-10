
'use client';
import { useEffect, useState } from 'react';
import { getUserSession, getUserRole } from '@/auth/session';
import InventoryViewer from '@/components/InventoryViewer';
import AdminInventoryViewer from '@/components/AdminInventoryViewer';

export default function InventoryPage() {
  const [role, setRole] = useState(null);
  console.log('🔍 [page.tsx] const [role, setRole] = useState(null);');

  useEffect(() => {
    async function resolveRole() {
      const session = await getUserSession();
      console.log('🔍 [page.tsx] const session = await getUserSession();');
      const userRole = await getUserRole(session?.user.id);
      console.log('🔍 [page.tsx] const userRole = await getUserRole(session?.user.id);');
      setRole(userRole);
    }

    resolveRole();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Inventory Portal</h1>
      {role === 'admin' ? <AdminInventoryViewer /> : null}
      {role === 'client' ? <InventoryViewer /> : null}
      {!role && <p>Loading user role...</p>}
    </main>
  );
}
