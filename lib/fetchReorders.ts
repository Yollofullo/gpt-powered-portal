import { supabase } from '@/lib/supabaseClient';
import { ReorderRequest } from '@/lib/zustandStore';

export async function fetchReorders(): Promise<ReorderRequest[]> {
  const { data, error } = await supabase
    .from('reorder_requests')
    .select('id, item_id, quantity, status, created_at, fulfilled_at, inventory(name)')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map((r: any) => ({
    ...r,
    item_name: r.inventory?.name || '',
  }));
}
