'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function TestInventory() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInventory = async () => {
    console.log('🔍 [TestInventory.tsx] Entering function: const fetchInventory = async ');
      const { data, error } = await supabase.from('inventory_items').select('*')
      if (error) console.error('Error loading inventory:', error.message)
      setItems(data || [])
      setLoading(false)
    }
    fetchInventory()
  }, [])

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Inventory</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              {item.name} — Qty: {item.quantity}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
