"use client";

import { ReactNode, useCallback, useState } from "react";
import { PointerSensor } from "./utils";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragCancelEvent,
} from "@dnd-kit/core";
import {
  OnDragCancelArgs,
  OnDragEndArgs,
  OnDragStartArgs,
  OnRenderDraggedArgs,
} from "./types";

// A huge distance effectively disables dragging when true
const DISABLE_DRAGGING_DISTANCE = 100000;

interface DndProviderProps<T> {
  children: ReactNode;
  onDragEnd: (args: OnDragEndArgs) => void;
  onDragCancel: (args: OnDragCancelArgs) => void;
  onDragStart: (args: OnDragStartArgs<T>) => void;
  onRenderDragged: (args: OnRenderDraggedArgs<T>) => ReactNode;
  disabled?: boolean;
}

const DndProvider = <T,>({
  onRenderDragged: DraggedItem,
  onDragEnd,
  onDragStart,
  onDragCancel,
  children,
  disabled = false,
}: DndProviderProps<T>) => {
  const [activeItem, setActiveItem] = useState<T | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: disabled ? DISABLE_DRAGGING_DISTANCE : 6,
      },
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

export default DndProvider;
