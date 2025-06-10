import { planRoute } from "../components/RouteCalculator";
import { Stop } from "../types";

describe("planRoute", () => {
  const stops: Stop[] = [
    { id: "1", address: "A", coords: [0, 0] },
    { id: "2", address: "B", coords: [3, 4] },
  ];

  it("calculates correct route values", async () => {
    const result = await planRoute(stops);
    expect(result.distance).toBeCloseTo(5000, 1);
    expect(result.duration).toBeCloseTo(500, 1);
    expect(result.geometry.length).toBe(2);
  });
});
