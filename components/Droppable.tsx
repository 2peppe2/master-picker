import { relativeSemesterToYearAndSemester } from "@/lib/semesterYearTranslations";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import React, { FC, ReactNode, useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useAtomValue } from "jotai";
import {
  scheduleAtoms,
  WILDCARD_BLOCK_START,
} from "@/app/atoms/schedule/atoms";

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

  const draggedCourse = useAtomValue(scheduleAtoms.draggedCourseAtom);
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const { semester, year } = relativeSemesterToYearAndSemester(
    startingYear,
    semesterNumber,
  );

  const isWildcard = blockNumber >= WILDCARD_BLOCK_START;

  const isValidDropTarget = useMemo(() => {
    if (!draggedCourse) return false;

    const targetPeriod = periodNumber + 1;
    const targetBlock = blockNumber + 1;

    const matchingOccasions = draggedCourse.CourseOccasion.filter(
      (occ) => occ.year === year && occ.semester === semester,
    );

    if (matchingOccasions.length === 0) return false;

    return matchingOccasions.some((matchingOccasion) => {
      const matchingPeriod = matchingOccasion.periods.find(
        (p) => p.period === targetPeriod,
      );

      if (!matchingPeriod) return false;

      if (isWildcard) return true;

      if (matchingPeriod.blocks.length > 0) {
        return matchingPeriod.blocks.includes(targetBlock);
      }

      return false;
    });
  }, [draggedCourse, blockNumber, periodNumber, year, semester, isWildcard]);

  const baseStyles =
    "relative w-40 h-40 shrink-0 flex items-center justify-center border-4 border-dashed rounded-2xl transition-all duration-200";

  let stateStyles = "";
  let feedbackOverlay = null;

  if (isValidDropTarget) {
    if (isOver) {
      stateStyles =
        "border-teal-500 z-10 animate-wiggle shadow-lg shadow-teal-500/20";
      feedbackOverlay = (
        <div className="absolute inset-0 bg-teal-500/20 rounded-xl pointer-events-none" />
      );
    } else {
      stateStyles = "border-cyan-500 animate-wiggle";
      feedbackOverlay = (
        <div className="absolute inset-0 bg-cyan-500/10 rounded-xl pointer-events-none" />
      );
    }
  } else if (isOver) {
    stateStyles = "border-red-500";
    feedbackOverlay = (
      <div className="absolute inset-0 bg-red-500/10 rounded-xl pointer-events-none" />
    );
  } else {
    if (isWildcard) {
      stateStyles =
        "border-sky-500/20 bg-sky-500/5 hover:border-sky-500/40 hover:bg-sky-500/10";
    } else {
      stateStyles =
        "border-zinc-300 dark:border-zinc-700 bg-secondary/30 hover:border-zinc-400 hover:bg-secondary/50";
    }
  }

  return (
    <div ref={setNodeRef} className={`${baseStyles} ${stateStyles}`}>
      {children}
      {feedbackOverlay}
    </div>
  );
};
