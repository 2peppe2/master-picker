
import React from 'react';
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import { Course } from '@/app/courses';

type DraggableProps = {
  id: string;
  data: Course
  children: React.ReactNode;
}
function Draggable(props: DraggableProps) {
  const {attributes, listeners, setNodeRef, transform, active} = useDraggable({
    id: props.id,
    data: props.data,
  });
  const isDragging = active?.id === props.id;
  const style: React.CSSProperties = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
    touchAction: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    zIndex: isDragging ? 9999 : undefined,
  };

  return (
    
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} suppressHydrationWarning>
      {props.children}
    </div>
  );
}
export {Draggable};