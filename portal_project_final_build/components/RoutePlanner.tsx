import React, { useEffect, useState, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import { MapRenderer } from "./MapRenderer";
import { StopManager } from "./StopManager";
import { planRoute } from "./RouteCalculator";
import { useRouteStore } from "./useRouteStore";
import { safeFetch } from "../utils/safeFetch";
import { Stop } from "../types";
import debounce from "lodash.debounce";

const WAREHOUSE_CENTER: [number, number] = [1, 1];

const isValidAddress = (address: string) =>
  /^[A-Za-z0-9\s,.'-]+$/.test(address.trim()) && address.trim().length > 0;

const isValidCoords = ([lng, lat]: [number, number]) =>
  lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;

const RoutePlanner: React.FC = () => {
  const { stops, addStop } = useRouteStore();
  const [isPlanning, setIsPlanning] = useState(false);

  // Debounced route planning
  const debouncedPlanRoute = useCallback(
    debounce(async (stops: Stop[]) => {
      // isPlanning is already set to true before debounce is called
      const [result, error] = await safeFetch(planRoute(stops));
      setIsPlanning(false);
      if (result) {
        console.log("Planned route:", result);
      } else {
        console.error("Failed to plan route:", error);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (stops.length > 1) {
      setIsPlanning(true); // Set before debounce
      debouncedPlanRoute(stops);
    }
  }, [stops, debouncedPlanRoute]);

  const handleAddStop = () => {
    const newStop: Stop = {
      id: Date.now().toString(),
      address: "New Stop",
      coords: [1 + Math.random() * 0.01, 1 + Math.random() * 0.01],
    };

    if (isValidAddress(newStop.address) && isValidCoords(newStop.coords)) {
      addStop(newStop);
    } else {
      alert("Invalid stop: Check address or coordinates.");
    }
  };

  return (
    <div>
      <MapRenderer warehouseCenter={WAREHOUSE_CENTER} />
      <div className="p-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2" onClick={handleAddStop}>
          <FaPlus /> Add Stop
        </button>
        {isPlanning && (
          <span className="mt-2 text-blue-600" aria-live="polite">Planning route</span>
        )}
        <StopManager />
      </div>
    </div>
  );
};

export default RoutePlanner;
