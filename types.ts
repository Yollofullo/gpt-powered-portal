export interface Stop {
  id: string;
  address: string;
  coords: [number, number];
}

export interface Route {
  stops: Stop[];
}

export interface RouteResult {
  distance: number;
  duration: number;
  geometry: [number, number][];
}
