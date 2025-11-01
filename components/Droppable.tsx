import { Course } from "@/app/courses";
import { useDroppable } from "@dnd-kit/core";
import React, { FC, ReactNode } from "react";

export type PeriodNodeData = {
  semester: number;
  period: number;
  block: number;
};

interface DroppableProps {
  id: string;
  data: PeriodNodeData;
  children: ReactNode;
  activeCourse: Course | null;
}

export const Droppable: FC<DroppableProps> = ({
  activeCourse,
  children,
  data,
  id,
}) => {
  const { semester, period, block } = data;
  const { isOver, setNodeRef } = useDroppable({
    id,
    data,
  });

  let overStyles: string = isOver ? "border-red-500" : "border-zinc-500";

  if (isOver && activeCourse !== null) {
    if (
      (activeCourse.semester === semester + 7 &&
        activeCourse.period[0] === period + 1) ||
      (activeCourse.period.length > 1 &&
        activeCourse.period[1] === period + 1 &&
        activeCourse.block === block + 1)
    ) {
      // Valid drop target
      overStyles = "border-teal-500";
    }
  }

  return (
    <div
      ref={setNodeRef}
      className={`w-40 h-40 flex items-center justify-center ${overStyles} border-4 border-dashed rounded-2xl`}
    >
      {children}
    </div>
  );
};
