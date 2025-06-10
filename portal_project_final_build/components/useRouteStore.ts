import { create } from "zustand";
import { Stop } from "../types";

interface RouteState {
  stops: Stop[];
  addStop: (stop: Stop) => void;
  removeStop: (id: string) => void;
  reorderStops: (sourceIndex: number, destinationIndex: number) => void;
  updateStop: (id: string, newAddress: string) => void;
  setStops: (stops: Stop[]) => void;
}

export const useRouteStore = create<RouteState>((set) => ({
  stops: [],
  addStop: (stop) => set((state) => ({ stops: [...state.stops, stop] })),
  removeStop: (id) => set((state) => ({ stops: state.stops.filter((s) => s.id !== id) })),
  reorderStops: (sourceIndex, destinationIndex) =>
    set((state) => {
      const updated = Array.from(state.stops);
      const [moved] = updated.splice(sourceIndex, 1);
      updated.splice(destinationIndex, 0, moved);
      return { stops: updated };
    }),
  updateStop: (id, newAddress) =>
    set((state) => ({
      stops: state.stops.map((s) => (s.id === id ? { ...s, address: newAddress } : s)),
    })),
  setStops: (stops) => set({ stops }),
}));
