
'use client';
import { useEffect, useState } from 'react';
import { getUserSession, getUserRole } from '@/auth/session';
import { formatItemName, parseQuantity } from '@/utils_merged/formatting';
import { supabase } from '@/lib/supabaseClient';

export default function InventoryViewer() {
  const [items, setItems] = useState([]);
  console.log('🔍 [InventoryViewer.tsx] const [items, setItems] = useState([]);');
  const [loading, setLoading] = useState(true);
  console.log('🔍 [InventoryViewer.tsx] const [loading, setLoading] = useState(true);');

  useEffect(() => {
    async function loadInventory() {
      const session = await getUserSession();
      console.log('🔍 [InventoryViewer.tsx] const session = await getUserSession();');
      const role = await getUserRole(session?.user.id);
      console.log('🔍 [InventoryViewer.tsx] const role = await getUserRole(session?.user.id);');

      if (role === 'client') {
        const { data, error } = await supabase
          .from('inventory_items')
          .select('name, quantity')
          .eq('user_id', session?.user.id);

        if (!error) {
          setItems(data.map(item => ({
            name: formatItemName(item.name),
            quantity: parseQuantity(item.quantity)
          })));
        }
      }
      setLoading(false);
    }

    loadInventory();
  }, []);

  return (
    <div>
      <h2>Inventory</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {items.map((item, idx) => (
            <li key={idx}>
              {item.name} — Qty: {item.quantity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
