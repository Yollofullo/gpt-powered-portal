import { Stop } from "../types";

/**
 * Simulate route planning between a series of stops.
 * Returns distance (in meters), estimated duration (in seconds), and geometry (route path).
 */
export const planRoute = async (stops: Stop[]): Promise<{ distance: number; duration: number; geometry: [number, number][] }> => {
  let distance = 0;
  for (let i = 1; i < stops.length; i++) {
    const [x1, y1] = stops[i - 1].coords;
    const [x2, y2] = stops[i].coords;
    distance += Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) * 1000;
  }
  return {
    distance,
    duration: distance / 10,
    geometry: stops.map((s) => s.coords),
  };
};
