import { useEffect } from 'react';
import { useReorderStore, ReorderRequest } from '@/stores/reorderStore';
import { supabase } from '@/lib/supabaseClient';

export function useReorderRequests() {
  const setReorderRequests = useReorderStore((s) => s.setReorderRequests);

  useEffect(() => {
    let subscription: any;
    async function fetchAndSubscribe() {
      // Fetch reorder requests with join to inventory for item_name and fulfilled_at
      const { data, error } = await supabase
        .from('reorder_requests')
        .select('id, item_id, quantity, status, created_at, fulfilled_at, inventory(name)')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setReorderRequests(
          data.map((r: any) => ({
            ...r,
            item_name: r.inventory?.name || '',
          }))
        );
      }
      // Real-time subscription for INSERT and UPDATE
      subscription = supabase
        .channel('reorder_requests')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'reorder_requests' },
          (payload: { new: ReorderRequest }) => {
            const newRequest = payload.new;
            supabase
              .from('inventory')
              .select('name')
              .eq('id', newRequest.item_id)
              .single()
              .then(({ data }: { data: { name: string } | null }) => {
                setReorderRequests((prev) => [
                  { ...newRequest, item_name: data?.name || '' },
                  ...prev,
                ]);
              });
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'reorder_requests' },
          (payload: { new: ReorderRequest }) => {
            const updated = payload.new;
            supabase
              .from('inventory')
              .select('name')
              .eq('id', updated.item_id)
              .single()
              .then(({ data }: { data: { name: string } | null }) => {
                setReorderRequests((prev) =>
                  prev.map((r) =>
                    r.id === updated.id
                      ? { ...updated, item_name: data?.name || '' }
                      : r
                  )
                );
              });
          }
        )
        .subscribe();
    }
    fetchAndSubscribe();
    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [setReorderRequests]);
}
