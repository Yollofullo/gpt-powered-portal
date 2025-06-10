import { useInventoryStore } from '@/lib/zustandStore';
import { supabase } from '@/lib/supabaseClient';
import type { InventoryItem } from '@/lib/zustandStore';

const InventoryGrid = () => {
console.log('🔍 [InventoryGrid.tsx] Entering function: const InventoryGrid = ');
  const { inventory } = useInventoryStore();
  console.log('🔍 [InventoryGrid.tsx] const { inventory } = useInventoryStore();');

  const getStockColor = (quantity: number) => {
  console.log('🔍 [InventoryGrid.tsx] Entering function: const getStockColor = ');
    return quantity > 10 ? 'bg-green-200' : quantity > 5 ? 'bg-yellow-200' : 'bg-red-200';
  };

  const handleReorder = async (item: InventoryItem) => {
  console.log('🔍 [InventoryGrid.tsx] Entering function: const handleReorder = async ');
    await supabase.from('reorder_requests').insert({ item_id: item.id, quantity: item.stock_level });
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {inventory.map((item: InventoryItem) => (
        <div key={item.id} className={`border p-4 ${getStockColor(item.stock_level)}`}>
          <h3>{item.name}</h3>
          <p>Stock: {item.stock_level}</p>
          <button onClick={() => handleReorder(item)}>Reorder</button>
        </div>
      ))}
    </div>
  );
};

export default InventoryGrid;
