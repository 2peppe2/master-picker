"use client";

import { scheduleAtoms } from "@/app/dashboard/(store)/schedule/atoms";
import { preferenceAtoms } from "@/app/dashboard/(store)/preferences/atoms";
import { filterAtoms } from "@/app/dashboard/(store)/filter/atoms";
import Translate from "@/common/components/translate/Translate";
import { Draggable } from "@/components/DndProvider/Draggable";
import { Droppable } from "@/components/Droppable";
import { useAtomValue, useSetAtom } from "jotai";
import CourseCard from "@/components/CourseCard";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockProps } from ".";
import { FC } from "react";

const StandardBlock: FC<BlockProps> = ({ courseSlot, data }) => {
  const draggedCourse = useAtomValue(scheduleAtoms.draggedCourseAtom);

  const isThisCourseBeingDragged = draggedCourse?.code === courseSlot?.code;
  const shouldShowCourse = courseSlot && !isThisCourseBeingDragged;

  const selectBlocks = useSetAtom(filterAtoms.blocksAtom);
  const selectPeriods = useSetAtom(filterAtoms.periodsAtom);
  const selectSemesters = useSetAtom(filterAtoms.semestersAtom);
  const setActiveTab = useSetAtom(preferenceAtoms.activeTabAtom);

  const handleFilterChange = () => {
    selectSemesters([data.semesterNumber + 1]);
    selectPeriods([data.periodNumber + 1]);
    selectBlocks([data.blockNumber + 1]);
    setActiveTab("search");
  };

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
      ) : courseSlot && isThisCourseBeingDragged ? (
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
      ) : (
        <div
          onClick={handleFilterChange}
          className="flex flex-col items-center justify-center h-full w-full group cursor-pointer"
        >
          <SearchIcon className="text-zinc-500 group-hover:text-foreground size-8 mb-2 transition-colors" />
          <span className="text-zinc-500 font-medium select-none">
            <Translate text="_block_label" args={{ b: data.blockNumber + 1 }} />
          </span>
        </div>
      )}
    </Droppable>
  );
};

export default StandardBlock;
