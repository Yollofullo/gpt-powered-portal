import ResponsivePortalLayout from '../../../components/ResponsivePortalLayout';
import { supabase } from '../../../lib/supabaseClient';
import React from 'react';
import { cookies } from 'next/headers';

interface Order {
  id: string;
  item: string;
  status: string;
}

async function getOrders() {
  // If you need to pass auth, use cookies().get('sb-access-token') or similar
  const { data, error } = await supabase
    .from('orders')
    .select('id, item, status');
  if (error) {
    return [];
  }
  return data as Order[];
}

export default async function DashboardPage() {
  const orders = await getOrders();

  return (
    <ResponsivePortalLayout>
      <div className="p-4 space-y-8">
        <section>
          <h1 className="text-2xl font-bold mb-2">Welcome to your Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Here you can view your latest orders and stats.
          </p>
        </section>
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Your Orders</h3>
          <ul className="space-y-2">
            {orders.map((order) => (
              <li
                key={order.id}
                className="border p-2 rounded bg-gray-50 dark:bg-gray-900"
              >
                <div className="font-medium">{order.item}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Status: {order.status}
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="bg-blue-50 dark:bg-blue-900 rounded-lg shadow p-4 flex flex-col items-center">
          <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">
            📦 12
          </div>
          <div className="text-gray-700 dark:text-gray-200">
            Total Orders This Month
          </div>
        </section>
      </div>
    </ResponsivePortalLayout>
  );
}
