// Add Jest globals for TypeScript
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="jest" />

// Add jest-dom matchers for TypeScript
import '@testing-library/jest-dom';

import React, { act } from "react";
import { render } from "@testing-library/react";
import { MapRenderer } from "../components/MapRenderer";
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

describe("MapRenderer", () => {
  it("renders map container", async () => {
    await act(async () => {
      useRouteStore.setState({ stops: [] });
    });
    const { container } = render(<MapRenderer warehouseCenter={[0, 0]} />);
    expect(container.firstChild).toHaveClass("w-full");
  });
});
