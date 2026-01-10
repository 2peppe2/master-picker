import { activeCourseAtom } from "@/app/atoms/ActiveCourseAtom";
import { useDroppable } from "@dnd-kit/core";
import { useAtomValue } from "jotai";
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
}

export const Droppable: FC<DroppableProps> = ({
  children,
  data,
  id,
}) => {
  const { semester, period, block } = data;
  const { isOver, setNodeRef } = useDroppable({
    id,
    data,
  });
  const activeCourse = useAtomValue(activeCourseAtom);
  
  let overStyles: string = isOver ? "border-red-500" : "border-zinc-500";

  if (isOver && activeCourse !== null) {
    const isSameSemester = activeCourse.semester === semester + 7;
    const isSamePeriod = activeCourse.period.includes(period + 1);
    const isSameBlock = activeCourse.block === block + 1;
    if (isSameSemester && isSamePeriod && isSameBlock) {
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
