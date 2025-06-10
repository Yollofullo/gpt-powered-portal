import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Order } from '@/types/types';

export function useFulfillment(): UseQueryResult<Order[]> {
console.log('🔍 [useFulfillment.ts] Entering function: export function useFulfillment');
  return useQuery<Order[]>({
    queryKey: ['fulfillment'],
    queryFn: async () => {
      const { data, error } = await supabase.from('fulfillment').select('*');
      console.log('🔍 [useFulfillment.ts] const { data, error } = await supabase.from('fulfillment').select('*');');
      if (error) {
        throw new Error(error.message);
      }
      return (data ?? []) as Order[];
    },
  });
}
