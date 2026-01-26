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
  const { semester } = relativeSemesterToYearAndSemester(
    startingYear,
    semesterNumber,
  );
  const {
    getters: { hasMatchingOccasion, findMatchingOccasion },
  } = useScheduleStore();

  const isValidDropTarget = useMemo(() => {
    if (!activeCourse) return false;

    const matchingOccasion = findMatchingOccasion({
      course: activeCourse,
      block: blockNumber + 1,
      period: periodNumber + 1,
      year: startingYear,
      semester,
    });

    if (!matchingOccasion) return false;

    const targetBlock = blockNumber + 1;
    const targetPeriod = periodNumber + 1;

    const isCorrectBlock = matchingOccasion.periods.some((p) => {
      if (p.period !== targetPeriod) return false;

      // If normal course
      if (p.blocks.length > 0) {
        return p.blocks.includes(targetBlock);
      }

      // If wildcard course
      if (p.blocks.length === 0) {
        return targetBlock > WILDCARD_BLOCK_START;
      }

      return false;
    });

    const hasMatching = hasMatchingOccasion({
      course: activeCourse,
      blocks: [targetBlock],
      periods: [targetPeriod],
    });

    if (!isCorrectBlock) {
      return false;
    }

    // If normal course
    if (hasMatching) {
      return true;
    }

    // If wildcard course
    if (targetBlock > WILDCARD_BLOCK_START) {
      return true;
    }

    return false;
  }, [
    activeCourse,
    findMatchingOccasion,
    blockNumber,
    periodNumber,
    startingYear,
    semester,
    hasMatchingOccasion,
  ]);

  let overStyles: string = isOver ? "border-red-500" : "border-zinc-500";

  if (isValidDropTarget) {
    if (isOver) {
      overStyles = "border-teal-500 animate-wiggle";
    } else {
      overStyles = "border-cyan-500 animate-wiggle";
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
