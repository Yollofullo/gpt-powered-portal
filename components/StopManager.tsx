import React, { useState, useRef } from "react";
import { FaGripVertical, FaTrash, FaUndo } from "react-icons/fa";
import { useRouteStore } from "./useRouteStore";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Stop } from "../types";

const isValidAddress = (address: string) =>
  /^[A-Za-z0-9\s,.'-]+$/.test(address.trim()) && address.trim().length > 0;

export const StopManager: React.FC = () => {
  const { stops, removeStop, reorderStops, updateStop } = useRouteStore();
  const [editing, setEditing] = useState<{ [key: string]: boolean }>({});
  const [invalid, setInvalid] = useState<{ [key: string]: boolean }>({});
  const [history, setHistory] = useState<Stop[][]>([]);
  const undoRef = useRef(false);

  const handleRemove = (id: string) => {
    setHistory((prev) => [...prev, stops]);
    removeStop(id);
    undoRef.current = true;
  };

  const handleUndo = () => {
    if (undoRef.current && history.length > 0) {
      const prev = history[history.length - 1];
      useRouteStore.getState().setStops(prev);
      setHistory(history.slice(0, -1));
      undoRef.current = false;
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    reorderStops(result.source.index, result.destination.index);
  };

  const handleChange = (id: string, newVal: string) => {
    if (isValidAddress(newVal)) {
      updateStop(id, newVal);
      setInvalid((prev) => ({ ...prev, [id]: false }));
    } else {
      setInvalid((prev) => ({ ...prev, [id]: true }));
    }
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="stops">
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps}>
              {stops.map((stop, index) => (
                <Draggable key={stop.id} draggableId={stop.id} index={index}>
                  {(provided) => (
                    <li ref={provided.innerRef} {...provided.draggableProps} className="flex items-center gap-2 py-1">
                      <span {...provided.dragHandleProps}><FaGripVertical /></span>
                      {editing[stop.id] ? (
                        <input
                          value={stop.address}
                          onChange={(e) => handleChange(stop.id, e.target.value)}
                          onBlur={() => setEditing((prev) => ({ ...prev, [stop.id]: false }))}
                          className={`border rounded px-2 ${invalid[stop.id] ? "border-red-500" : ""}`}
                          aria-label="Stop Address"
                        />
                      ) : (
                        <button
                          type="button"
                          aria-label="Edit Stop"
                          onClick={() => setEditing((prev) => ({ ...prev, [stop.id]: true }))}
                          className="bg-transparent border-none p-0 m-0 text-left"
                          style={{ background: "none" }}
                        >
                          {stop.address}
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label="Remove Stop"
                        onClick={() => handleRemove(stop.id)}
                      >
                        <FaTrash />
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      {undoRef.current && (
        <button onClick={handleUndo} className="mt-2 text-blue-600" aria-label="Undo Delete">
          <FaUndo /> Undo
        </button>
      )}
    </div>
  );
};
