import React, { useEffect, useRef } from "react";
import maplibregl, { Map, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRouteStore } from "./useRouteStore";

interface MapRendererProps {
  warehouseCenter: [number, number];
}

export const MapRenderer: React.FC<MapRendererProps> = ({ warehouseCenter }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const markerRefs = useRef<Record<string, Marker>>({});
  const { stops } = useRouteStore();

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = new maplibregl.Map({
        container: mapRef.current,
        style: "https://demotiles.maplibre.org/style.json",
        center: warehouseCenter,
        zoom: 13,
      });
    }
  }, [warehouseCenter]);

  useEffect(() => {
    if (!mapInstance.current) return;

    stops.forEach((stop) => {
      const marker = markerRefs.current[stop.id];
      if (marker) {
        marker.setLngLat(stop.coords);
      } else {
        markerRefs.current[stop.id] = new maplibregl.Marker().setLngLat(stop.coords).addTo(mapInstance.current!);
      }
    });

    Object.keys(markerRefs.current).forEach((id) => {
      if (!stops.find((s) => s.id === id)) {
        markerRefs.current[id].remove();
        delete markerRefs.current[id];
      }
    });
  }, [stops]);

  return <div ref={mapRef} className="w-full h-96" />;
};
