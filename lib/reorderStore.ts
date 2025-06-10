import { create } from 'zustand';

export type ReorderRequest = {
  id: string;
  item_id: string;
  quantity: number;
  status: 'pending' | 'fulfilled';
  created_at: string;
  fulfilled_at?: string;
  item_name?: string;
};

export type ReorderFilter = 'all' | 'pending' | 'fulfilled';
console.log('🔍 [reorderStore.ts] export type ReorderFilter = 'all' | 'pending' | 'fulfilled';');

interface ReorderState {
  reorderRequests: ReorderRequest[];
  filter: ReorderFilter;
  setReorderRequests: (requests: ReorderRequest[] | ((prev: ReorderRequest[]) => ReorderRequest[])) => void;
  console.log('🔍 [reorderStore.ts] setReorderRequests: (requests: ReorderRequest[] | ((prev: ReorderRequest[]) => ReorderRequest[])) => void;');
  setFilter: (filter: ReorderFilter) => void;
  console.log('🔍 [reorderStore.ts] setFilter: (filter: ReorderFilter) => void;');
}

export const useReorderStore = create<ReorderState>((set) => ({
  reorderRequests: [],
  filter: 'all',
  setReorderRequests: (requests) =>
    set((state) => ({
      reorderRequests:
        typeof requests === 'function' ? requests(state.reorderRequests) : requests,
    })),
  setFilter: (filter) => set({ filter }),
}));
