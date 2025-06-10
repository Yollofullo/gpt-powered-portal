import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { FaSearch, FaCheck, FaTimes } from "react-icons/fa";

interface ManualOrder {
  id: string;
  customer: string;
  status: string;
  total: number;
  payment_status: "paid" | "unpaid";
}

const ManualPaymentPanel: React.FC = () => {
console.log('🔍 [ManualPaymentPanel.tsx] Entering function: const ManualPaymentPanel: React.FC = ');
  const [orders, setOrders] = useState<ManualOrder[]>([]);
  console.log('🔍 [ManualPaymentPanel.tsx] const [orders, setOrders] = useState<ManualOrder[]>([]);');
  const [search, setSearch] = useState("");
  console.log('🔍 [ManualPaymentPanel.tsx] const [search, setSearch] = useState("");');
  const [updating, setUpdating] = useState<string | null>(null);
  console.log('🔍 [ManualPaymentPanel.tsx] const [updating, setUpdating] = useState<string | null>(null);');
  const [confirm, setConfirm] = useState<{ id: string; next: "paid" | "unpaid" } | null>(null);
  console.log('🔍 [ManualPaymentPanel.tsx] const [confirm, setConfirm] = useState<{ id: string; next: "paid" | "unpaid" } | null>(null);');

  useEffect(() => {
    const fetchOrders = async () => {
    console.log('🔍 [ManualPaymentPanel.tsx] Entering function: const fetchOrders = async ');
      const { data, error } = await supabase
        .from("orders")
        .select("id, customer, status, total, payment_status")
        .order("created_at", { ascending: false });
      if (!error && data) setOrders(data as ManualOrder[]);
    };
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
  console.log('🔍 [ManualPaymentPanel.tsx] Entering function: const filteredOrders = useMemo');
    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  const handleUpdate = async (id: string, next: "paid" | "unpaid") => {
  console.log('🔍 [ManualPaymentPanel.tsx] Entering function: const handleUpdate = async ');
    setUpdating(id);
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: next })
      .eq("id", id);
    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, payment_status: next } : o))
      );
    }
    setUpdating(null);
    setConfirm(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="mb-4 flex gap-2 items-center">
        <FaSearch className="text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          className="w-full md:w-80 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
          placeholder="Search by order ID or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Order ID</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Customer</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Status</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Total</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Paid</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">No orders found.</td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-4 py-2 font-mono text-sm">{order.id}</td>
                  <td className="px-4 py-2">{order.customer}</td>
                  <td className="px-4 py-2 capitalize">{order.status}</td>
                  <td className="px-4 py-2 text-right">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">
                    {order.payment_status === "paid" ? (
                      <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold"><FaCheck /> Paid</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold"><FaTimes /> Unpaid</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <select
                      className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none"
                      value={order.payment_status}
                      disabled={updating === order.id}
                      onChange={(e) => setConfirm({ id: order.id, next: e.target.value as "paid" | "unpaid" })}
                    >
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Confirmation Dialog */}
      {confirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Confirm Payment Status Update</h2>
            <p className="mb-4">Are you sure you want to mark this order as <span className="font-bold">{confirm.next}</span>?</p>
            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                onClick={() => setConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
                onClick={() => handleUpdate(confirm.id, confirm.next)}
                disabled={updating === confirm.id}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualPaymentPanel;
