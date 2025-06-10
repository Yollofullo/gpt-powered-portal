import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export function useClients() {
console.log('🔍 [useClients.ts] Entering function: export function useClients');
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase.from('clients').select('*');
      console.log('🔍 [useClients.ts] const { data, error } = await supabase.from('clients').select('*');');
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}
