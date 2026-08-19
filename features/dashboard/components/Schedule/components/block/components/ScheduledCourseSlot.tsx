"use client";

import { isCourseBeingDraggedAtom } from "@/features/dashboard/state/drag/atoms";
import { Draggable } from "@/features/dashboard/components/DndProvider/Draggable";
import DashboardCourseCard from "@/features/dashboard/components/DashboardCourseCard";
import type { BlockProps } from "..";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import type { FC } from "react";

const ScheduledCourseSlot: FC<BlockProps> = ({ courseSlot, data }) => {
  const isBeingDragged = useAtomValue(
    isCourseBeingDraggedAtom(courseSlot?.code ?? ""),
  );

  if (!courseSlot) return null;

  if (isBeingDragged) {
    return (
      <div
        className={cn(
          "h-full w-full transition-opacity duration-200",
          "pointer-events-none opacity-30 grayscale-[0.5]",
        )}
      >
        <DashboardCourseCard variant="dropped" course={courseSlot} />
      </div>
    );
  }

  return (
    <Draggable
      data={courseSlot}
      id={`${courseSlot.code}-${data.periodNumber}-${data.blockNumber}`}
    >
      <DashboardCourseCard variant="dropped" course={courseSlot} />
    </Draggable>
  );
};

export default ScheduledCourseSlot;
