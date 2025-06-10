'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import useCurrentRole from '@/hooks/useCurrentRole'

export default function ClientInventory() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const role = useCurrentRole()

  useEffect(() => {
    if (role !== 'client') return

    const fetchInventory = async () => {
    console.log('🔍 [ClientInventory.tsx] Entering function: const fetchInventory = async ');
      const { data, error } = await supabase
        .from('inventory_items')
        .select('name, quantity')

      if (error) {
        console.error('Error fetching inventory:', error.message)
        setError('Unable to load inventory.')
      } else {
        setItems(data || [])
      }

      setLoading(false)
    }

    fetchInventory()
  }, [role])

  if (role !== 'client') return null

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Your Inventory</h2>
      {loading ? (
        <p className="text-gray-500 italic">Loading your inventory...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 italic">No items available.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="bg-white p-3 rounded shadow border">
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
