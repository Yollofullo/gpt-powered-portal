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
console.log('🔍 [zustandStore.ts] export type ReorderFilter = 'all' | 'pending' | 'fulfilled';');
export type ReorderSortKey = 'date' | 'status' | 'quantity';
console.log('🔍 [zustandStore.ts] export type ReorderSortKey = 'date' | 'status' | 'quantity';');

interface ReorderState {
  reorderRequests: ReorderRequest[];
  filter: ReorderFilter;
  searchTerm: string;
  sortKey: ReorderSortKey;
  setReorderRequests: (data: ReorderRequest[] | ((prev: ReorderRequest[]) => ReorderRequest[])) => void;
  console.log('🔍 [zustandStore.ts] setReorderRequests: (data: ReorderRequest[] | ((prev: ReorderRequest[]) => ReorderRequest[])) => void;');
  setFilter: (filter: ReorderFilter) => void;
  console.log('🔍 [zustandStore.ts] setFilter: (filter: ReorderFilter) => void;');
  setSearchTerm: (term: string) => void;
  console.log('🔍 [zustandStore.ts] setSearchTerm: (term: string) => void;');
  setSortKey: (key: ReorderSortKey) => void;
  console.log('🔍 [zustandStore.ts] setSortKey: (key: ReorderSortKey) => void;');
  updateReorderStatus: (id: string, status: 'pending' | 'fulfilled', fulfilled_at?: string) => void;
  console.log('🔍 [zustandStore.ts] updateReorderStatus: (id: string, status: 'pending' | 'fulfilled', fulfilled_at?: string) => void;');
}

export const useReorderStore = create<ReorderState>((set) => ({
  reorderRequests: [],
  filter: 'all',
  searchTerm: '',
  sortKey: 'date',
  setReorderRequests: (data) =>
    set((state) => ({
      reorderRequests:
        typeof data === 'function' ? data(state.reorderRequests) : data,
    })),
  setFilter: (filter) => set({ filter }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSortKey: (key) => set({ sortKey: key }),
  updateReorderStatus: (id, status, fulfilled_at) =>
    set((state) => ({
      reorderRequests: state.reorderRequests.map((r) =>
        r.id === id ? { ...r, status, fulfilled_at } : r
      ),
    })),
}));

export type InventoryItem = {
  id: string;
  name: string;
  stock_level: number;
  // Add other fields as needed
};

interface InventoryState {
  inventory: InventoryItem[];
  setInventory: (data: InventoryItem[]) => void;
  console.log('🔍 [zustandStore.ts] setInventory: (data: InventoryItem[]) => void;');
  selectedItem: InventoryItem | null;
  reorderModalOpen: boolean;
  updateInventoryItem: (item: InventoryItem) => void;
  console.log('🔍 [zustandStore.ts] updateInventoryItem: (item: InventoryItem) => void;');
  setSelectedItem: (item: InventoryItem) => void;
  console.log('🔍 [zustandStore.ts] setSelectedItem: (item: InventoryItem) => void;');
  toggleReorderModal: () => void;
  console.log('🔍 [zustandStore.ts] toggleReorderModal: () => void;');
  setSearchTerm: (term: string) => void;
  console.log('🔍 [zustandStore.ts] setSearchTerm: (term: string) => void;');
  searchTerm: string;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  inventory: [],
  selectedItem: null,
  reorderModalOpen: false,
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  setInventory: (data) => set({ inventory: data }),
  updateInventoryItem: (updatedItem) =>
    set((state) => ({
      inventory: state.inventory.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      ),
    })),
  setSelectedItem: (item) => set({ selectedItem: item }),
  toggleReorderModal: () =>
    set((state) => ({ reorderModalOpen: !state.reorderModalOpen })),
}));
