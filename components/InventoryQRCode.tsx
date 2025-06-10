import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { sanitizeQRData } from "../utils/sanitize";

export default function InventoryQRCode({ id }: { id: string }) {
  const [scanResult, setScanResult] = useState("");
  console.log('🔍 [InventoryQRCode.tsx] const [scanResult, setScanResult] = useState("");');

  const handleScan = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log('🔍 [InventoryQRCode.tsx] Entering function: const handleScan = ');
    const sanitized = sanitizeQRData(e.target.value);
    console.log('🔍 [InventoryQRCode.tsx] const sanitized = sanitizeQRData(e.target.value);');
    setScanResult(sanitized || "");
    if (!sanitized) alert("Invalid QR code scanned.");
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 w-full max-w-md mx-auto text-center">
      <h3 className="text-lg font-semibold mb-3">Inventory QR Code</h3>
      <QRCodeSVG value={id} size={128} className="mx-auto mb-4" />
      <input
        className="border rounded w-full px-4 py-2 text-sm"
        placeholder="Enter or scan result..."
        value={scanResult}
        onChange={handleScan}
      />
    </div>
  );
}