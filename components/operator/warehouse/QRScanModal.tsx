import { useState } from 'react';
import { useInventoryStore, InventoryItem } from '@/lib/zustandStore';
import { supabase } from '@/lib/supabaseClient';

const QRScanModal = () => {
console.log('🔍 [QRScanModal.tsx] Entering function: const QRScanModal = ');
  const { updateInventoryItem, inventory } = useInventoryStore();
  console.log('🔍 [QRScanModal.tsx] const { updateInventoryItem, inventory } = useInventoryStore();');
  const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null);
  console.log('🔍 [QRScanModal.tsx] const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null);');

  const handleScan = async (itemId: string) => {
  console.log('🔍 [QRScanModal.tsx] Entering function: const handleScan = async ');
    const item = inventory.find((i: InventoryItem) => i.id === itemId);
    console.log('🔍 [QRScanModal.tsx] const item = inventory.find((i: InventoryItem) => i.id === itemId);');
    console.log('🔍 [QRScanModal.tsx] Entering function: const item = inventory.find');
    if (!item) return;

    const updatedItem: InventoryItem = { ...item, stock_level: item.stock_level + 1 };
    console.log('🔍 [QRScanModal.tsx] const updatedItem: InventoryItem = { ...item, stock_level: item.stock_level + 1 };');
    updateInventoryItem(updatedItem);

    const { error } = await supabase
      .from('inventory')
      .update({ stock_level: updatedItem.stock_level })
      .eq('id', itemId);

    if (!error) setScannedItem(updatedItem);
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-md">
      <h3 className="text-lg font-semibold">Simulate QR Scan</h3>
      <div className="flex gap-4 mt-2">
        <button onClick={() => handleScan('1')} className="p-2 bg-blue-500 text-white rounded">
          Scan Item A
        </button>
        <button onClick={() => handleScan('2')} className="p-2 bg-green-500 text-white rounded">
          Scan Item B
        </button>
      </div>
      {scannedItem && (
        <div className="mt-3 text-green-600">
          ✅ Scanned: {scannedItem.name}, New Stock: {scannedItem.stock_level}
        </div>
      )}
    </div>
  );
};

export default QRScanModal;
