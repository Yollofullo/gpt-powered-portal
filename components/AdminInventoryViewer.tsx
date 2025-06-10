
'use client';
import { useEffect, useState } from 'react';
import { getUserSession, getUserRole } from '@/auth/session';
import { supabase } from '@/lib/supabaseClient';

export default function AdminInventoryViewer() {
  const [items, setItems] = useState([]);
  console.log('🔍 [AdminInventoryViewer.tsx] const [items, setItems] = useState([]);');
  const [loading, setLoading] = useState(true);
  console.log('🔍 [AdminInventoryViewer.tsx] const [loading, setLoading] = useState(true);');

  useEffect(() => {
    async function loadAllInventory() {
      const session = await getUserSession();
      console.log('🔍 [AdminInventoryViewer.tsx] const session = await getUserSession();');
      const role = await getUserRole(session?.user.id);
      console.log('🔍 [AdminInventoryViewer.tsx] const role = await getUserRole(session?.user.id);');

      if (role === 'admin') {
        const { data, error } = await supabase
          .from('inventory_items')
          .select('*');

        if (!error) {
          setItems(data);
        }
      }
      setLoading(false);
    }

    loadAllInventory();
  }, []);

  return (
    <div>
      <h2>Full Inventory (Admin View)</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {items.map((item, idx) => (
            <li key={idx}>
              {item.name} — Qty: {item.quantity} (User ID: {item.user_id})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
