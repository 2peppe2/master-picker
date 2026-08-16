"use client";

import { cn } from "@/lib/utils";

import { ReactNode, useCallback, useState } from "react";
import { KeyboardSensor, MouseSensor, TouchSensor } from "./utils";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragCancelEvent,
  DragOverEvent,
  CollisionDetection,
  MeasuringFrequency,
  MeasuringStrategy,
  closestCenter,
  pointerWithin,
} from "@dnd-kit/core";
import {
  OnDragCancelArgs,
  OnDragEndArgs,
  OnDragStartArgs,
  OnDragOverArgs,
  OnRenderDraggedArgs,
} from "./types";

// A huge distance/delay effectively disables dragging when true
const DISABLE_DRAGGING_DISTANCE = 100000;
const DISABLE_DRAGGING_DELAY = 100000;

// On touch, require a short press-and-hold before a drag starts so that quick
// swipes still scroll the page instead of accidentally picking up a card.
const TOUCH_ACTIVATION_DELAY = 200;
const TOUCH_ACTIVATION_TOLERANCE = 8;

// Pointer hit-testing feels natural for mouse/touch drags. Keyboard drags do
// not have pointer coordinates, so retain the library's spatial fallback.
const pointerFirstCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  // Outside a target, pointer drags must have no "over" target at all. The
  // spatial fallback exists solely for keyboard dragging, which has no pointer.
  return args.pointerCoordinates === null
    ? closestCenter(args)
    : pointerCollisions;
};

interface DndProviderProps<T> {
  children: ReactNode;
  onDragEnd: (args: OnDragEndArgs) => void;
  onDragCancel: (args: OnDragCancelArgs) => void;
  onDragStart: (args: OnDragStartArgs<T>) => void;
  onDragOver: (args: OnDragOverArgs) => void;
  onRenderDragged: (args: OnRenderDraggedArgs<T>) => ReactNode;
  disabled?: boolean;
}

const DndProvider = <T,>({
  onRenderDragged: DraggedItem,
  onDragEnd,
  onDragStart,
  onDragCancel,
  onDragOver,
  children,
  disabled = false,
}: DndProviderProps<T>) => {
  const [activeItem, setActiveItem] = useState<T | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: disabled ? DISABLE_DRAGGING_DISTANCE : 1,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: disabled ? DISABLE_DRAGGING_DELAY : TOUCH_ACTIVATION_DELAY,
        tolerance: TOUCH_ACTIVATION_TOLERANCE,
      },
    }),
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

  const handleDragCancel = useCallback(
    (event: DragCancelEvent) => {
      setActiveItem(null);
      onDragCancel({ over: event.over });
    },
    [onDragCancel],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => onDragOver({ over: event.over }),
    [onDragOver],
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
      collisionDetection={pointerFirstCollisionDetection}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
          frequency: MeasuringFrequency.Optimized,
        },
      }}
      accessibility={{
        screenReaderInstructions: {
          draggable: cn(
            "To pick up a course, press Space or Enter. Use the",
            "arrow keys to move it, then press Space or Enter to",
            "drop it.",
          ),
        },
      }}
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
