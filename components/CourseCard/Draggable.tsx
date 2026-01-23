import { Course } from "@/app/dashboard/page";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React, { FC, ReactNode, CSSProperties } from "react";

interface DraggableProps {
  id: string;
  data: Course;
  children: ReactNode;
}

const Draggable: FC<DraggableProps> = ({ id, data, children }) => {
  const { attributes, listeners, setNodeRef, transform, active } = useDraggable(
    { id, data }
  );

  const isDragging = active?.id === id;

  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
    touchAction: "none",
    WebkitUserSelect: "none",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    zIndex: isDragging ? 9999 : undefined,
  } satisfies CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
};
export { Draggable };
