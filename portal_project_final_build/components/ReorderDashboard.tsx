import React, { ChangeEvent, useEffect, useState } from 'react';
import { useReorderStore, ReorderRequest, ReorderFilter, ReorderSortKey } from '@/lib/zustandStore';
import { supabase } from '@/lib/supabaseClient';
import { fetchReorders } from '@/lib/fetchReorders';
import clsx from 'clsx';

function sortReorders(reorders: ReorderRequest[], sortKey: ReorderSortKey): ReorderRequest[] {
console.log('🔍 [ReorderDashboard.tsx] Entering function: function sortReorders');
  switch (sortKey) {
    case 'status':
      return [...reorders].sort((a, b) => a.status.localeCompare(b.status));
      console.log('🔍 [ReorderDashboard.tsx] return [...reorders].sort((a, b) => a.status.localeCompare(b.status));');
    case 'quantity':
      return [...reorders].sort((a, b) => b.quantity - a.quantity);
      console.log('🔍 [ReorderDashboard.tsx] return [...reorders].sort((a, b) => b.quantity - a.quantity);');
    case 'date':
    default:
      return [...reorders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      console.log('🔍 [ReorderDashboard.tsx] return [...reorders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());');
  }
}

export default function ReorderDashboard() {
  const {
    reorderRequests,
    filter,
    searchTerm,
    sortKey,
    setReorderRequests,
    setFilter,
    setSearchTerm,
    setSortKey,
    updateReorderStatus,
  } = useReorderStore();
  console.log('🔍 [ReorderDashboard.tsx] } = useReorderStore();');
  const [loading, setLoading] = useState<boolean>(true);
  console.log('🔍 [ReorderDashboard.tsx] const [loading, setLoading] = useState<boolean>(true);');
  const [inserting, setInserting] = useState<boolean>(false);
  console.log('🔍 [ReorderDashboard.tsx] const [inserting, setInserting] = useState<boolean>(false);');
  const [error, setError] = useState<string | null>(null);
  console.log('🔍 [ReorderDashboard.tsx] const [error, setError] = useState<string | null>(null);');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  console.log('🔍 [ReorderDashboard.tsx] const [confirmId, setConfirmId] = useState<string | null>(null);');

  // Initial fetch and realtime subscription
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    console.log('🔍 [ReorderDashboard.tsx] let channel: ReturnType<typeof supabase.channel> | null = null;');
    setLoading(true);
    fetchReorders()
      .then((data) => setReorderRequests(data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
      console.log('🔍 [ReorderDashboard.tsx] .finally(() => setLoading(false));');
    channel = supabase
      .channel('reorder_requests')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reorder_requests' }, (payload: { new: ReorderRequest }) => {
        setReorderRequests((prev: ReorderRequest[]) => [
          { ...payload.new, item_name: payload.new.item_name || '' },
          ...prev,
        ]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'reorder_requests' }, (payload: { new: ReorderRequest }) => {
        setReorderRequests((prev: ReorderRequest[]) =>
          prev.map((r: ReorderRequest) =>
            r.id === payload.new.id ? { ...r, ...payload.new } : r
          )
        );
      })
      .subscribe();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [setReorderRequests]);

  // Filtering, searching, sorting
  const filtered = reorderRequests
    .filter((r: ReorderRequest) => filter === 'all' || r.status === filter)
    .filter((r: ReorderRequest) => r.item_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    console.log('🔍 [ReorderDashboard.tsx] .filter((r: ReorderRequest) => r.item_name?.toLowerCase().includes(searchTerm.toLowerCase()));');
  const sorted = sortReorders(filtered, sortKey);
  console.log('🔍 [ReorderDashboard.tsx] const sorted = sortReorders(filtered, sortKey);');

  // Fulfill action
  async function markAsFulfilled(req: ReorderRequest) {
    updateReorderStatus(req.id, 'fulfilled', new Date().toISOString());
    await supabase
      .from('reorder_requests')
      .update({ status: 'fulfilled', fulfilled_at: new Date().toISOString() })
      .eq('id', req.id);
    setConfirmId(null);
  }

  // Dev/test insert
  async function simulateReorderInsert() {
    setInserting(true);
    const item_id = 'INV-1001';
    console.log('🔍 [ReorderDashboard.tsx] const item_id = 'INV-1001';');
    const quantity = Math.floor(Math.random() * 10) + 1;
    console.log('🔍 [ReorderDashboard.tsx] const quantity = Math.floor(Math.random() * 10) + 1;');
    await supabase.from('reorder_requests').insert({ item_id, quantity, status: 'pending' });
    setInserting(false);
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reorder Requests</h1>
        <button
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-semibold"
          onClick={simulateReorderInsert}
          disabled={inserting}
        >
          {inserting ? 'Inserting...' : 'Test Insert'}
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <input
          className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Search by item name..."
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className={clsx('px-3 py-1 rounded border text-sm', sortKey === 'date' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-700')}
            onClick={() => setSortKey('date')}
          >Date</button>
          <button
            className={clsx('px-3 py-1 rounded border text-sm', sortKey === 'status' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-700')}
            onClick={() => setSortKey('status')}
          >Status</button>
          <button
            className={clsx('px-3 py-1 rounded border text-sm', sortKey === 'quantity' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-700')}
            onClick={() => setSortKey('quantity')}
          >Quantity</button>
        </div>
      </div>
      <div className="flex gap-3 mb-6">
        {(['all', 'pending', 'fulfilled'] as ReorderFilter[]).map((f: ReorderFilter) => (
          <button
            key={f}
            className={clsx(
              'px-4 py-2 rounded-full border font-medium',
              filter === f
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            )}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-10">{error}</div>
      ) : sorted.length === 0 ? (
        <div className="text-gray-500 text-center py-10">No reorder requests found.</div>
      ) : (
        <div className="space-y-4">
          {sorted.map((req: ReorderRequest) => (
            <div
              key={req.id}
              className={clsx(
                'p-5 rounded-lg shadow flex items-center justify-between',
                req.status === 'pending'
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-white border border-gray-200'
              )}
            >
              <div>
                <div className="font-semibold text-lg text-gray-800">{req.item_name || 'Unknown Item'}</div>
                <div className="text-gray-500 text-sm">Qty: {req.quantity}</div>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={clsx(
                    'px-3 py-1 rounded-full text-xs font-semibold mb-2',
                    req.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  )}
                >
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
                <span className="text-xs text-gray-400 mb-2">
                  {new Date(req.created_at).toLocaleString()}
                </span>
                {req.status === 'fulfilled' && req.fulfilled_at && (
                  <span className="text-xs text-green-500">Fulfilled: {new Date(req.fulfilled_at).toLocaleString()}</span>
                )}
                {req.status === 'pending' && (
                  <>
                    <button
                      className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-semibold"
                      onClick={() => setConfirmId(req.id)}
                    >
                      Mark as Fulfilled
                    </button>
                    {confirmId === req.id && (
                      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                        <div className="bg-white p-6 rounded shadow-lg max-w-xs w-full">
                          <div className="mb-4 text-gray-800 font-semibold">Confirm fulfillment?</div>
                          <div className="flex gap-2 justify-end">
                            <button
                              className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                              onClick={() => setConfirmId(null)}
                            >
                              Cancel
                            </button>
                            <button
                              className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                              onClick={() => markAsFulfilled(req)}
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
