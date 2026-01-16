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
  if (isOver && activeCourse !== null) {
    const isSameYear = activeCourse.CourseOccasion.map((occ) => occ.year).includes(year);
    const isSameSemester = activeCourse.CourseOccasion.map((occ) => occ.semester).includes(semester);
    const isSamePeriod = activeCourse.CourseOccasion.some((occ) =>
      occ.periods.map((p) => p.period).includes(periodNumber + 1)
    );
    const isSameBlock = activeCourse.CourseOccasion.some((occ) =>
      occ.periods.some((p) => p.blocks.includes(blockNumber + 1))
    );

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
