"use client";

import { ReactNode, useCallback, useState } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  TouchSensor,
  PointerSensor,
  KeyboardSensor,
  DragStartEvent,
  DragEndEvent,
  Over,
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

interface DndProviderProps<T> {
  children: ReactNode;
  onDragEnd: (args: OnDragEndArgs) => void;
  onDragStart: (args: OnDragStartArgs<T>) => void;
  renderDragged: (args: RenderDraggedArgs<T>) => ReactNode;
}

export const DndProvider = <T,>({
  renderDragged: DraggedItem,
  onDragEnd,
  onDragStart,
  children,
}: DndProviderProps<T>) => {
  const [activeItem, setActiveItem] = useState<T | null>(null);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
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

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
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
