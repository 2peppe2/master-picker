import { relativeSemesterToYearAndSemester } from "@/lib/semesterYearTranslations";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { activeCourseAtom } from "@/app/atoms/ActiveCourseAtom";
import React, { FC, ReactNode, useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useAtomValue } from "jotai";
import {
  useScheduleStore,
  WILDCARD_BLOCK_START,
} from "@/app/atoms/schedule/scheduleStore";

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
  const { semester, year } = relativeSemesterToYearAndSemester(
    startingYear,
    semesterNumber,
  );
  const {
    getters: { hasMatchingOccasion, findMatchingOccasion },
  } = useScheduleStore();

  const isWildcard = blockNumber >= WILDCARD_BLOCK_START;

  const isValidDropTarget = useMemo(() => {
    if (!activeCourse) return false;

    const matchingOccasion = findMatchingOccasion({
      course: activeCourse,
      block: blockNumber + 1,
      period: periodNumber + 1,
      year,
      semester,
    });

    if (!matchingOccasion) return false;

    const targetBlock = blockNumber + 1;
    const targetPeriod = periodNumber + 1;

    const isCorrectBlock = matchingOccasion.periods.some((p) => {
      if (p.period !== targetPeriod) return false;

      // Is standard course?
      if (p.blocks.length > 0) {
        return p.blocks.includes(targetBlock);
      }

      // Is wildcard course?
      if (p.blocks.length === 0) {
        return targetBlock > WILDCARD_BLOCK_START;
      }

      return false;
    });

    if (!isCorrectBlock) return false;

    if (targetBlock > WILDCARD_BLOCK_START) {
      return true;
    }

    return hasMatchingOccasion({
      course: activeCourse,
      blocks: [targetBlock],
      periods: [targetPeriod],
    });
  }, [
    activeCourse,
    findMatchingOccasion,
    blockNumber,
    periodNumber,
    year,
    semester,
    hasMatchingOccasion,
  ]);

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
