"use client";

import { ScheduleGrid } from "@/features/dashboard/state/schedule/types";
import { WILDCARD_BLOCK_START } from "../atoms";
import { Course } from "@/common/types";
import { useCallback } from "react";
import { produce } from "immer";

interface GeneratePrefilledScheduleArgs {
  courses: Course[];
  startingYear: number;
}

export const generatePrefilledSchedule = ({
  courses,
  startingYear,
}: GeneratePrefilledScheduleArgs) => {
  const initialGrid: ScheduleGrid = Array.from({ length: 10 }, () =>
    Array.from({ length: 2 }, () => Array.from({ length: 4 }, () => null)),
  );

  return produce(initialGrid, (draft) => {
    courses.forEach((course) => {
      const occasion = course.CourseOccasion?.[0];

      if (!occasion || !occasion.periods) return;

      const yearDifference = occasion.year - startingYear;
      if (yearDifference < 0) return;

      const semesterIndex =
        occasion.semester === "HT"
          ? yearDifference * 2
          : yearDifference * 2 - 1;

      if (!draft[semesterIndex]) return;

      for (const period of occasion.periods) {
        if (period.period < 1) continue;

        const periodIndex = period.period - 1;
        const periodBlocks = draft[semesterIndex][periodIndex];
        if (!periodBlocks) continue;

        const isWildcardCourse = period.blocks.length === 0;

        if (isWildcardCourse) {
          // Find first empty wildcard slot or add new block
          let placed = false;
          for (let i = WILDCARD_BLOCK_START; i < periodBlocks.length; i++) {
            if (periodBlocks[i] === null) {
              periodBlocks[i] = course;
              placed = true;
              break;
            }
          }

          if (!placed) {
            periodBlocks.push(course);
          }
        } else {
          // Place in specified blocks
          for (const block of period.blocks) {
            const blockIndex = block - 1;
            periodBlocks[blockIndex] = course;
          }
        }
      }
    });
  });
};

/** Creates a schedule-grid generator bound to the current scheduling rules. */
export const useGeneratePrefilledSchedule = () =>
  useCallback(
    (args: GeneratePrefilledScheduleArgs) => generatePrefilledSchedule(args),
    [],
  );
