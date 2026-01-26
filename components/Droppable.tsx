import { relativeSemesterToYearAndSemester } from "@/lib/semesterYearTranslations";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { activeCourseAtom } from "@/app/atoms/ActiveCourseAtom";
import React, { FC, ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useAtomValue } from "jotai";
import { useScheduleStore } from "@/app/atoms/schedule/scheduleStore";

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

export const Droppable: FC<DroppableProps> = ({ children, data, id }) => {
  const { semesterNumber, periodNumber, blockNumber } = data;
  const { setNodeRef, isOver } = useDroppable({
    id,
    data,
  });
  const activeCourse = useAtomValue(activeCourseAtom);
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const { year, semester } = relativeSemesterToYearAndSemester(
    startingYear,
    semesterNumber,
  );
  const {
    getters: { hasMatchingOccasion },
  } = useScheduleStore();

  let overStyles: string = isOver ? "border-red-500" : "border-zinc-500";
  if (activeCourse !== null) {
    const isSameYear = activeCourse.CourseOccasion.map(
      (occ) => occ.year,
    ).includes(year);

    const isSameSemester = activeCourse.CourseOccasion.map(
      (occ) => occ.semester,
    ).includes(semester);

    const isMatchingOccasion = hasMatchingOccasion({
      course: activeCourse,
      blocks: [blockNumber + 1],
      periods: [periodNumber + 1],
    });

    if (isSameYear && isSameSemester && isMatchingOccasion) {
      if (isOver) {
        overStyles = "border-teal-500 animate-wiggle";
      } else {
        overStyles = "border-cyan-500 animate-wiggle";
      }
    }
  }

  return (
    <div
      ref={setNodeRef}
      className={`w-40 h-40 shrink-0 flex items-center justify-center ${overStyles} border-4 border-dashed rounded-2xl`}
    >
      {children}
    </div>
  );
};
