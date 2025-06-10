import { useState, useEffect } from 'react';
import { useInventoryStore } from '@/lib/zustandStore';
import { supabase } from '@/lib/supabaseClient';
import InventoryGrid from './InventoryGrid';
// Remove or stub InventoryList if not present
// import InventoryList from './InventoryList';
import SearchBar from './SearchBar';
import QRScanModal from './QRScanModal';

type ViewMode = 'grid' | 'list';
console.log('🔍 [OperatorWarehouseView.tsx] type ViewMode = 'grid' | 'list';');

const OperatorWarehouseView = () => {
console.log('🔍 [OperatorWarehouseView.tsx] Entering function: const OperatorWarehouseView = ');
  const { inventory, setSearchTerm } = useInventoryStore();
  console.log('🔍 [OperatorWarehouseView.tsx] const { inventory, setSearchTerm } = useInventoryStore();');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  console.log('🔍 [OperatorWarehouseView.tsx] const [viewMode, setViewMode] = useState<ViewMode>('grid');');

  useEffect(() => {
    const fetchInventory = async () => {
    console.log('🔍 [OperatorWarehouseView.tsx] Entering function: const fetchInventory = async ');
      const { data, error } = await supabase.from('inventory').select('*');
      console.log('🔍 [OperatorWarehouseView.tsx] const { data, error } = await supabase.from('inventory').select('*');');
      if (!error && data) {
        useInventoryStore.setState({ inventory: data });
      }
    };
    fetchInventory();
  }, []);

  return (
    <div className="p-4">
      <SearchBar onSearch={setSearchTerm} />
      <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
        Toggle View
      </button>
      {viewMode === 'grid' ? <InventoryGrid /> : <div>List view coming soon</div>}
      <QRScanModal />
    </div>
  );
};

export default OperatorWarehouseView;
