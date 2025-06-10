import React, { useEffect, useMemo, useState } from "react";
import { FaSearch, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { supabase } from "../lib/supabaseClient";

export type OrderStatus = "pending" | "fulfilled" | "canceled";
console.log('🔍 [OperatorOrderList.tsx] export type OrderStatus = "pending" | "fulfilled" | "canceled";');

export interface OperatorOrder {
  id: string;
  customer: string;
  status: OrderStatus;
  created_at: string; // ISO string
  total: number;
}

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Fulfilled", value: "fulfilled" },
  { label: "Canceled", value: "canceled" },
] as const;

type StatusFilter = typeof STATUS_OPTIONS[number]["value"];
console.log('🔍 [OperatorOrderList.tsx] type StatusFilter = typeof STATUS_OPTIONS[number]["value"];');

const statusIcon = (status: OrderStatus) => {
console.log('🔍 [OperatorOrderList.tsx] Entering function: const statusIcon = ');
  switch (status) {
    case "pending":
      return <FaClock className="text-yellow-500" title="Pending" />;
      console.log('🔍 [OperatorOrderList.tsx] return <FaClock className="text-yellow-500" title="Pending" />;');
    case "fulfilled":
      return <FaCheckCircle className="text-green-600" title="Fulfilled" />;
      console.log('🔍 [OperatorOrderList.tsx] return <FaCheckCircle className="text-green-600" title="Fulfilled" />;');
    case "canceled":
      return <FaTimesCircle className="text-red-500" title="Canceled" />;
      console.log('🔍 [OperatorOrderList.tsx] return <FaTimesCircle className="text-red-500" title="Canceled" />;');
    default:
      return null;
  }
};

const OperatorOrderList: React.FC = () => {
console.log('🔍 [OperatorOrderList.tsx] Entering function: const OperatorOrderList: React.FC = ');
  const [orders, setOrders] = useState<OperatorOrder[]>([]);
  console.log('🔍 [OperatorOrderList.tsx] const [orders, setOrders] = useState<OperatorOrder[]>([]);');
  const [status, setStatus] = useState<StatusFilter>("all");
  console.log('🔍 [OperatorOrderList.tsx] const [status, setStatus] = useState<StatusFilter>("all");');
  const [search, setSearch] = useState("");
  console.log('🔍 [OperatorOrderList.tsx] const [search, setSearch] = useState("");');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  console.log('🔍 [OperatorOrderList.tsx] const [selected, setSelected] = useState<Set<string>>(new Set());');

  // Fetch orders on mount
  useEffect(() => {
    let isMounted = true;
    console.log('🔍 [OperatorOrderList.tsx] let isMounted = true;');
    const fetchOrders = async () => {
    console.log('🔍 [OperatorOrderList.tsx] Entering function: const fetchOrders = async ');
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && isMounted && data) {
        setOrders(data as OperatorOrder[]);
      }
    };
    fetchOrders();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("orders-list")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload: { new: OperatorOrder }) => {
          setOrders((prev) => [payload.new, ...prev]);
          console.log('🔍 [OperatorOrderList.tsx] setOrders((prev) => [payload.new, ...prev]);');
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload: { new: OperatorOrder }) => {
          setOrders((prev) =>
            prev.map((order) =>
              order.id === payload.new.id ? payload.new : order
            )
          );
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      console.log('🔍 [OperatorOrderList.tsx] isMounted = false;');
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredOrders = useMemo(() => {
  console.log('🔍 [OperatorOrderList.tsx] Entering function: const filteredOrders = useMemo');
    return orders.filter((order) => {
      const matchesStatus = status === "all" || order.status === status;
      console.log('🔍 [OperatorOrderList.tsx] const matchesStatus = status === "all" || order.status === status;');
      const matchesSearch =
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, status, search]);

  const allSelected = filteredOrders.length > 0 && filteredOrders.every((o) => selected.has(o.id));
  console.log('🔍 [OperatorOrderList.tsx] const allSelected = filteredOrders.length > 0 && filteredOrders.every((o) => selected.has(o.id));');
  console.log('🔍 [OperatorOrderList.tsx] Entering function: const allSelected = filteredOrders.length > 0 && filteredOrders.every');

  const toggleSelect = (id: string) => {
  console.log('🔍 [OperatorOrderList.tsx] Entering function: const toggleSelect = ');
    setSelected((prev) => {
      const next = new Set(prev);
      console.log('🔍 [OperatorOrderList.tsx] const next = new Set(prev);');
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
  console.log('🔍 [OperatorOrderList.tsx] Entering function: const toggleSelectAll = ');
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredOrders.map((o) => o.id)));
      console.log('🔍 [OperatorOrderList.tsx] setSelected(new Set(filteredOrders.map((o) => o.id)));');
    }
  };

  const handleBatchAction = async (action: 'fulfilled' | 'canceled') => {
  console.log('🔍 [OperatorOrderList.tsx] Entering function: const handleBatchAction = async ');
    setOrders((prev) =>
      prev.map((order) =>
        selected.has(order.id) ? { ...order, status: action } : order
      )
    );
    setSelected(new Set());
    // TODO: Add Supabase update logic here
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex gap-2 flex-wrap items-center">
          <label htmlFor="status-filter" className="sr-only">Order Status</label>
          <select
            id="status-filter"
            className="px-3 py-1 rounded border text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
            value={status}
            onChange={e => setStatus(e.target.value as StatusFilter)}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="relative w-full md:w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
            placeholder="Search by customer or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search orders"
          />
        </div>
      </div>

      {/* Batch Actions */}
      {selected.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-4 bg-blue-50 dark:bg-blue-900 p-3 rounded shadow animate-fade-in">
          <span className="font-medium text-blue-700 dark:text-blue-200">{selected.size} selected</span>
          <div className="flex gap-2">
            <button
              className="px-4 py-1 rounded bg-green-600 text-white text-sm font-semibold hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition"
              onClick={() => handleBatchAction('fulfilled')}
              type="button"
            >
              Mark as Fulfilled
            </button>
            <button
              className="px-4 py-1 rounded bg-red-600 text-white text-sm font-semibold hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition"
              onClick={() => handleBatchAction('canceled')}
              type="button"
            >
              Cancel Selected
            </button>
          </div>
        </div>
      )}

      {/* Table/Grid */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  aria-label="Select all orders"
                />
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Order ID</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Customer</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Created At</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Total</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">No orders found.</td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selected.has(order.id)}
                      onChange={() => toggleSelect(order.id)}
                      aria-label={`Select order ${order.id}`}
                    />
                  </td>
                  <td className="px-4 py-2 font-mono text-sm">{order.id}</td>
                  <td className="px-4 py-2">{order.customer}</td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    {statusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </td>
                  <td className="px-4 py-2 text-sm">{new Date(order.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">
                    <button className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition">View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OperatorOrderList;
