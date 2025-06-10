/// <reference types="jest" />

import { useRouteStore } from "../components/useRouteStore";
import { act } from "react";

describe("useRouteStore", () => {
  beforeEach(async () => {
    await act(async () => {
      useRouteStore.setState({ stops: [] });
    });
  });

  it("adds a stop", async () => {
    await act(async () => {
      useRouteStore.getState().addStop({ id: "1", address: "Test", coords: [0, 0] });
    });
    expect(useRouteStore.getState().stops.length).toBe(1);
  });

  it("removes a stop", async () => {
    await act(async () => {
      useRouteStore.getState().addStop({ id: "1", address: "Test", coords: [0, 0] });
      useRouteStore.getState().removeStop("1");
    });
    expect(useRouteStore.getState().stops.length).toBe(0);
  });

  it("updates a stop", async () => {
    await act(async () => {
      useRouteStore.getState().addStop({ id: "1", address: "Test", coords: [0, 0] });
      useRouteStore.getState().updateStop("1", "New Address");
    });
    expect(useRouteStore.getState().stops[0].address).toBe("New Address");
  });

  it("reorders stops", async () => {
    await act(async () => {
      useRouteStore.getState().setStops([
        { id: "1", address: "A", coords: [0, 0] },
        { id: "2", address: "B", coords: [1, 1] },
      ]);
      useRouteStore.getState().reorderStops(0, 1);
    });
    expect(useRouteStore.getState().stops[0].id).toBe("2");
  });
});
