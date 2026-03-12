"use client";

import { ReactNode, useCallback, useState } from "react";
import { PointerSensor, TouchSensor } from "./utils";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  Over,
  DragCancelEvent,
} from "@dnd-kit/core";

interface RenderDraggedArgs<T> {
  active: T;
}

export interface OnDragStartArgs<T> {
  active: T | null;
}

export interface OnDragEndArgs {
  over: Over | null;
}

export interface OnDragCancelArgs {
  over: Over | null;
}

interface DndProviderProps<T> {
  children: ReactNode;
  onDragEnd: (args: OnDragEndArgs) => void;
  onDragCancel: (args: OnDragCancelArgs) => void;
  onDragStart: (args: OnDragStartArgs<T>) => void;
  renderDragged: (args: RenderDraggedArgs<T>) => ReactNode;
}

export const DndProvider = <T,>({
  renderDragged: DraggedItem,
  onDragEnd,
  onDragStart,
  onDragCancel,
  children,
}: DndProviderProps<T>) => {
  const [activeItem, setActiveItem] = useState<T | null>(null);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const activeItem = event.active.data.current as T | null;

      if (activeItem) {
        setActiveItem(activeItem);
        onDragStart({ active: activeItem });
      }
    },
    [onDragStart],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveItem(null);
      onDragEnd({ over: event.over });
    },
    [onDragEnd],
  );

  const handleDragCancel = useCallback(
    (event: DragCancelEvent) => {
      setActiveItem(null);
      onDragCancel({ over: event.over });
    },
    [onDragCancel],
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
    >
      {children}

      <DragOverlay
        dropAnimation={{
          duration: 250,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {activeItem ? <DraggedItem active={activeItem} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
