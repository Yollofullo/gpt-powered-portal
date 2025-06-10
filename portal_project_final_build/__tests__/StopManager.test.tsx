// Add Jest globals for TypeScript
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="jest" />

import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { StopManager } from "../components/StopManager";
import { useRouteStore } from "../components/useRouteStore";

describe("StopManager", () => {
  beforeEach(async () => {
    await act(async () => {
      useRouteStore.setState({
        stops: [{ id: "1", address: "Test", coords: [0, 0] }]
      });
    });
  });

  it("renders stop and allows inline edit", async () => {
    await act(async () => {
      render(<StopManager />);
    });
    const stopButton = screen.getByRole("button", { name: /edit stop/i });
    fireEvent.click(stopButton);
    const input = screen.getByRole("textbox", { name: /stop address/i });
    fireEvent.change(input, { target: { value: "Updated" } });
    fireEvent.blur(input);
    expect(useRouteStore.getState().stops[0].address).toBe("Updated");
  });

  it("removes a stop and allows undo", async () => {
    await act(async () => {
      render(<StopManager />);
    });
    const deleteBtn = await screen.findByLabelText(/remove stop/i);
    fireEvent.click(deleteBtn);
    expect(screen.queryByText("Test")).toBeNull();
    const undoBtn = screen.getByLabelText(/undo delete/i);
    fireEvent.click(undoBtn);
    expect(screen.queryByText("Test")).toBeTruthy();
  });
});
