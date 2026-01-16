import { activeCourseAtom } from "@/app/atoms/ActiveCourseAtom";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { relativeSemesterToYearAndSemester } from "@/lib/semesterYearTranslations";
import { useDroppable } from "@dnd-kit/core";
import { useAtomValue } from "jotai";
import React, { FC, ReactNode } from "react";

export type PeriodNodeData = {
  semesterNumber: number;
  periodNumber: number;
  blockNumber: number;
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
  const { semesterNumber, periodNumber, blockNumber } = data;
  const { isOver, setNodeRef } = useDroppable({
    id,
    data,
  });
  const activeCourse = useAtomValue(activeCourseAtom);
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const {year, semester} = relativeSemesterToYearAndSemester(startingYear, semesterNumber);
  
  let overStyles: string = isOver ? "border-red-500" : "border-zinc-500";
  //TODO fix the occasion check to account for periods and blocks
  if (isOver && activeCourse !== null) {
    const isSameYear = activeCourse.CourseOccasion[0].year === year;
    const isSameSemester = activeCourse.CourseOccasion[0].semester === semester;
    const isSamePeriod = activeCourse.CourseOccasion[0].periods[0].period === periodNumber + 1;
    const isSameBlock = activeCourse.CourseOccasion[0].periods[0].blocks.includes(blockNumber + 1);
    if (isSameYear && isSameSemester && isSamePeriod && isSameBlock) {
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
