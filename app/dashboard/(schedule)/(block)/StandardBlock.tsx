"use client";

import { useFilterMutators } from "@/app/atoms/filter/hooks/useFilterMutators";
import { Draggable } from "@/components/DndProvider/Draggable";
import { scheduleAtoms } from "@/app/atoms/schedule/atoms";
import { SemesterOption } from "@/app/atoms/filter/types";
import { Droppable } from "@/components/Droppable";
import CourseCard from "@/components/CourseCard";
import { SearchIcon } from "lucide-react";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import { BlockProps } from ".";
import { FC } from "react";

const StandardBlock: FC<BlockProps> = ({ courseSlot, data }) => {
  const draggedCourse = useAtomValue(scheduleAtoms.draggedCourseAtom);

  const isThisCourseBeingDragged = draggedCourse?.code === courseSlot?.code;
  const shouldShowCourse = courseSlot && !isThisCourseBeingDragged;

  const { selectBlocks, selectPeriods, selectSemester } = useFilterMutators();

  const handleFilterChange = () => {
    selectSemester((data.semesterNumber + 1) as SemesterOption);
    selectPeriods([data.periodNumber + 1]);
    selectBlocks([data.blockNumber + 1]);
  };

  if (courseSlot && isThisCourseBeingDragged) {
    return (
      <div
        className={cn(
          "transition-opacity duration-200",
          draggedCourse
            ? "opacity-30 grayscale-[0.5] pointer-events-none"
            : "opacity-100",
        )}
      >
        <CourseCard variant="dropped" course={courseSlot} />
      </div>
    );
  }

  return (
    <Droppable
      data={data}
      id={`block-${data.semesterNumber}-${data.periodNumber}-${data.blockNumber}`}
    >
      {shouldShowCourse ? (
        <Draggable
          data={courseSlot}
          id={`${courseSlot.code}-${data.periodNumber}-${data.blockNumber}`}
        >
          <CourseCard variant="dropped" course={courseSlot} />
        </Draggable>
      ) : (
        <div
          onClick={handleFilterChange}
          className="flex flex-col items-center justify-center h-full w-full group cursor-pointer"
        >
          <SearchIcon className="text-zinc-500 group-hover:text-foreground size-8 mb-2 transition-colors" />
          <span className="text-zinc-500 font-medium select-none">
            Block {data.blockNumber + 1}
          </span>
        </div>
      )}
    </Droppable>
  );
};

export default StandardBlock;
