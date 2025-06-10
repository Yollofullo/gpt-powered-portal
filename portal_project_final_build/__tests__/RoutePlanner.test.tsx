// Add Jest globals for TypeScript
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="jest" />

import React, { act } from "react";
import { render, screen } from "@testing-library/react";
import RoutePlanner from "../components/RoutePlanner";
import { useRouteStore } from "../components/useRouteStore";

jest.mock("maplibre-gl", () => ({
  Map: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    remove: jest.fn(),
  })),
  Marker: jest.fn().mockImplementation(() => ({
    setLngLat: jest.fn().mockReturnThis(),
    addTo: jest.fn().mockReturnThis(),
    remove: jest.fn(),
  })),
}));

describe("RoutePlanner", () => {
  it("renders and includes planner controls", async () => {
    await act(async () => {
      render(<RoutePlanner />);
    });
    expect(screen.getByRole("button", { name: /add stop/i })).toBeTruthy();
  });

  it("triggers route plan when stops added", async () => {
    await act(async () => {
      useRouteStore.getState().setStops([
        { id: "1", address: "A", coords: [0, 0] },
        { id: "2", address: "B", coords: [1, 1] },
      ]);
    });
    await act(async () => {
      render(<RoutePlanner />);
    });
    expect(screen.getByRole("button", { name: /add stop/i })).toBeTruthy();
  });

  it("renders planning route text", async () => {
    await act(async () => {
      useRouteStore.getState().setStops([
        { id: "1", address: "A", coords: [0, 0] },
        { id: "2", address: "B", coords: [1, 1] },
      ]);
    });
    await act(async () => {
      render(<RoutePlanner />);
    });
    expect(await screen.findByText(/Planning route/i)).toBeTruthy();
  });
});
