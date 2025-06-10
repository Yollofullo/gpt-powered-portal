import React, { useEffect, useRef, useState } from "react";
import maplibregl, { Map, LngLatLike, MapLibreEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FaSearch, FaQrcode } from "react-icons/fa";

// Dummy warehouse zones and inventory
const ZONES = [
  { id: "A1", name: "Zone A1", coords: [0, 0], demand: 0.9, items: ["SKU123", "SKU124"] },
  { id: "A2", name: "Zone A2", coords: [1, 0], demand: 0.2, items: ["SKU125"] },
  { id: "B1", name: "Zone B1", coords: [0, 1], demand: 0.7, items: ["SKU126"] },
  { id: "B2", name: "Zone B2", coords: [1, 1], demand: 0.4, items: ["SKU127", "SKU128"] },
];

const INVENTORY = [
  { sku: "SKU123", name: "Widget Alpha", zone: "A1" },
  { sku: "SKU124", name: "Widget Beta", zone: "A1" },
  { sku: "SKU125", name: "Widget Gamma", zone: "A2" },
  { sku: "SKU126", name: "Widget Delta", zone: "B1" },
  { sku: "SKU127", name: "Widget Epsilon", zone: "B2" },
  { sku: "SKU128", name: "Widget Zeta", zone: "B2" },
];

interface InventoryItem {
  sku: string;
  name: string;
  zone: string;
}

const getZoneColor = (demand: number) => {
console.log('🔍 [WarehouseMap.tsx] Entering function: const getZoneColor = ');
  // 0 = blue, 1 = red
  if (demand > 0.7) return "#ef4444"; // red
  if (demand > 0.4) return "#f59e42"; // orange
  return "#3b82f6"; // blue
};

const WAREHOUSE_BOUNDS: [number, number, number, number] = [0, 0, 2, 2];
console.log('🔍 [WarehouseMap.tsx] const WAREHOUSE_BOUNDS: [number, number, number, number] = [0, 0, 2, 2];');

const WarehouseMap: React.FC = () => {
console.log('🔍 [WarehouseMap.tsx] Entering function: const WarehouseMap: React.FC = ');
  const mapRef = useRef<Map | null>(null);
  console.log('🔍 [WarehouseMap.tsx] const mapRef = useRef<Map | null>(null);');
  const mapContainer = useRef<HTMLDivElement | null>(null);
  console.log('🔍 [WarehouseMap.tsx] const mapContainer = useRef<HTMLDivElement | null>(null);');
  const [search, setSearch] = useState("");
  console.log('🔍 [WarehouseMap.tsx] const [search, setSearch] = useState("");');
  const [highlightedZone, setHighlightedZone] = useState<string | null>(null);
  console.log('🔍 [WarehouseMap.tsx] const [highlightedZone, setHighlightedZone] = useState<string | null>(null);');
  const [searchResults, setSearchResults] = useState<InventoryItem[]>(INVENTORY);
  console.log('🔍 [WarehouseMap.tsx] const [searchResults, setSearchResults] = useState<InventoryItem[]>(INVENTORY);');

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json",
      center: [1, 1],
      zoom: 16,
      minZoom: 15,
      maxZoom: 18,
      interactive: true,
      bounds: WAREHOUSE_BOUNDS,
      maxBounds: WAREHOUSE_BOUNDS,
    });
    mapRef.current = map;
    console.log('🔍 [WarehouseMap.tsx] mapRef.current = map;');

    // Add zones as rectangles
    ZONES.forEach((zone) => {
      const [x, y] = zone.coords;
      console.log('🔍 [WarehouseMap.tsx] const [x, y] = zone.coords;');
      const bounds: [[number, number], [number, number]] = [
        [x, y],
        [x + 1, y + 1],
      ];
      const color = getZoneColor(zone.demand);
      console.log('🔍 [WarehouseMap.tsx] const color = getZoneColor(zone.demand);');
      const id = `zone-${zone.id}`;
      console.log('🔍 [WarehouseMap.tsx] const id = `zone-${zone.id}`;');
      map.on("load", () => {
        map.addSource(id, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Polygon",
                  coordinates: [[
                    [x, y],
                    [x + 1, y],
                    [x + 1, y + 1],
                    [x, y + 1],
                    [x, y],
                  ]],
                },
                properties: { zoneId: zone.id },
              },
            ],
          },
        });
        // Only add the layer if highlightedZone is not null
        map.addLayer({
          id,
          type: "fill",
          source: id,
          paint: {
            "fill-color": color,
            "fill-opacity": [
              "case",
              ["==", ["get", "zoneId"], highlightedZone ?? ""],
              0.7,
              0.3,
            ],
          },
        });
      });
    });
    return () => {
      map.remove();
      mapRef.current = null;
      console.log('🔍 [WarehouseMap.tsx] mapRef.current = null;');
    };
  }, [highlightedZone]);

  // Search handler
  useEffect(() => {
    if (!search) {
      setSearchResults(INVENTORY);
    } else {
      setSearchResults(
        INVENTORY.filter(
          (item) =>
            item.sku.toLowerCase().includes(search.toLowerCase()) ||
            item.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search]);

  // Dummy QR scanner handler
  const handleScanQR = () => {
  console.log('🔍 [WarehouseMap.tsx] Entering function: const handleScanQR = ');
    // Simulate scanning a QR code and returning a SKU
    const random = INVENTORY[Math.floor(Math.random() * INVENTORY.length)];
    console.log('🔍 [WarehouseMap.tsx] const random = INVENTORY[Math.floor(Math.random() * INVENTORY.length)];');
    setSearch(random.sku);
    setHighlightedZone(random.zone);
  };

  // Highlight zone when item is clicked
  const handleItemClick = (item: InventoryItem) => {
  console.log('🔍 [WarehouseMap.tsx] Entering function: const handleItemClick = ');
    setHighlightedZone(item.zone);
    // Optionally, pan/zoom to the zone
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full h-[600px] bg-gray-100 dark:bg-gray-900 rounded-lg shadow p-4">
      {/* Map Panel */}
      <div className="flex-1 min-w-[300px] h-full rounded-lg overflow-hidden relative">
        <div ref={mapContainer} className="absolute inset-0 w-full h-full rounded-lg z-0" />
        {/* Overlay for highlight */}
        {highlightedZone && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded shadow z-10">
            Highlighted Zone: {highlightedZone}
          </div>
        )}
      </div>
      {/* Search & Inventory Panel */}
      <div className="w-full md:w-80 flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
              placeholder="Search SKU or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="ml-2 px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition flex items-center gap-2"
            onClick={handleScanQR}
            type="button"
          >
            <FaQrcode className="text-lg" />
            Scan QR
          </button>
        </div>
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg p-3 shadow-inner">
          <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Inventory</h3>
          <ul className="space-y-2">
            {searchResults.map((item) => (
              <li
                key={item.sku}
                className={`p-2 rounded cursor-pointer transition border ${
                  highlightedZone === item.zone
                    ? "bg-blue-100 dark:bg-blue-900 border-blue-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 border-transparent"
                }`}
                onClick={() => handleItemClick(item)}
              >
                <div className="font-mono text-sm">{item.sku}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{item.name} — Zone {item.zone}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WarehouseMap;
