"use client";

import { draggedCourseAtom } from "@/features/dashboard/state/drag/atoms";
import { Draggable } from "@/features/dashboard/components/DndProvider/Draggable";
import CourseCard from "@/common/components/CourseCard";
import type { BlockProps } from "..";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import type { FC } from "react";

const ScheduledCourseSlot: FC<BlockProps> = ({ courseSlot, data }) => {
  const draggedCourse = useAtomValue(draggedCourseAtom);

  if (!courseSlot) return null;

  if (draggedCourse?.code === courseSlot.code) {
    return (
      <div
        className={cn(
          "h-full w-full transition-opacity duration-200",
          "pointer-events-none opacity-30 grayscale-[0.5]",
        )}
      >
        <CourseCard variant="dropped" course={courseSlot} />
      </div>
    );
  }

  return (
    <Draggable
      data={courseSlot}
      id={`${courseSlot.code}-${data.periodNumber}-${data.blockNumber}`}
    >
      <CourseCard variant="dropped" course={courseSlot} />
    </Draggable>
  );
};

export default ScheduledCourseSlot;
