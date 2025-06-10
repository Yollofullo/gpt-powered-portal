'use client'

import React, { useEffect, useState } from 'react'
import { getOrders } from './exampleUsage'
import { supabase } from '@/lib/supabaseClient'
import useCurrentRole from '@/components/useCurrentRole'

const OrdersList = () => {
console.log('🔍 [page.tsx] Entering function: const OrdersList = ');
  const [orders, setOrders] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
    console.log('🔍 [page.tsx] Entering function: const fetchOrders = async ');
      const { data, error } = await supabase
        .from('orders')
        .select('id, customer, status')
        .order('created_at', { ascending: false })

      if (error) setError(error.message)
      else setOrders(data || [])
    }

    fetchOrders()
  }, [])

  if (error) return <div className="text-red-600">Error loading orders: {error}</div>
  if (!orders.length) return <div className="text-gray-500 italic">No orders found.</div>

  return (
    <ul className="grid gap-4 mt-6 sm:grid-cols-2 md:grid-cols-3">
      {orders.map((order) => (
        <li key={order.id} className="bg-white rounded shadow p-4 border border-gray-200">
          <div className="font-bold">Order #{order.id}</div>
          <div className="text-sm text-gray-700">Customer: {order.customer}</div>
          <div className="text-sm text-gray-500">Status: {order.status}</div>
        </li>
      ))}
    </ul>
  )
}

const InventoryList = () => {
console.log('🔍 [page.tsx] Entering function: const InventoryList = ');
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInventory = async () => {
    console.log('🔍 [page.tsx] Entering function: const fetchInventory = async ');
      const { data, error } = await supabase.from('inventory_items').select('*')
      if (error) console.error('Inventory load error:', error.message)
      setItems(data || [])
      setLoading(false)
    }

    fetchInventory()
  }, [])

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold mb-2">Inventory</h2>
      {loading ? <p>Loading...</p> : (
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              {item.name} - {item.quantity} in stock
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const Page = () => {
console.log('🔍 [page.tsx] Entering function: const Page = ');
  const role = useCurrentRole()

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <OrdersList />
      <InventoryList />
      <div className="mt-8 text-sm text-gray-400">Current role: {role ?? 'Unknown'}</div>
    </div>
  )
}

export default Page
