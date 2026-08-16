import React, { FC, ReactNode, CSSProperties } from "react";
import { Course } from "@/common/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface DraggableProps {
  id: string;
  data: Course;
  children: ReactNode;
}

const Draggable: FC<DraggableProps> = ({ id, data, children }) => {
  const { attributes, listeners, setNodeRef, transform, active } = useDraggable(
    { id, data },
  );

  const isDragging = active?.id === id;

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: "manipulation",
    WebkitUserSelect: "none",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    zIndex: isDragging ? 9999 : undefined,
  } satisfies CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="h-full w-full"
      {...listeners}
      {...attributes}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
};
export { Draggable };
