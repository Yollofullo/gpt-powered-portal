import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { sortDeliveries } from '@/lib/ai';
import { Order as DBOrder } from '@/types/types';

// Map DBOrder to AIOrder for sorting
interface AIOrder {
  priority: number;
  deliveryTime: string;
  distance: number;
}

export function useOrders() {
console.log('🔍 [useOrders.ts] Entering function: export function useOrders');
  const queryClient = useQueryClient();
  console.log('🔍 [useOrders.ts] const queryClient = useQueryClient();');

  const ordersQuery = useQuery<DBOrder[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*');
      console.log('🔍 [useOrders.ts] const { data, error } = await supabase.from('orders').select('*');');
      if (error) {
        throw new Error(error.message);
      }
      // If you have priority/deliveryTime/distance in DBOrder, map them; otherwise, just return data
      // Example mapping (adjust as needed):
      // const aiOrders: AIOrder[] = (data ?? []).map(o => ({
      //   priority: o.priority,
      //   deliveryTime: o.created_at, // or another field
      //   distance: 0 // or another field
      // }));
      // sortDeliveries(aiOrders);
      // For now, just return data as is
      return (data ?? []) as DBOrder[];
    },
  });

  const updateOrder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'Fulfilled' })
        .eq('id', id);
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return { ...ordersQuery, updateOrder };
}
