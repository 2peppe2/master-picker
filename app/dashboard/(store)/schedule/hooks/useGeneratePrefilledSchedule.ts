"use client";

import { useToRelativeSemester } from "@/common/hooks/useToRelativeSemester";
import { ScheduleGrid } from "@/app/dashboard/(store)/schedule/types";
import { WILDCARD_BLOCK_START } from "../atoms";
import { Course } from "@/app/dashboard/page";
import { useCallback } from "react";
import { produce } from "immer";

interface GeneratePrefilledScheduleArgs {
  courses: Course[];
  selectedOccasions?: Record<string, number>;
}

export const useGeneratePrefilledSchedule = () => {
  const yearAndSemesterToRelativeSemester = useToRelativeSemester();

  return useCallback(
    ({ courses, selectedOccasions }: GeneratePrefilledScheduleArgs) => {
      const initialGrid: ScheduleGrid = Array.from({ length: 10 }, () =>
        Array.from({ length: 2 }, () => Array.from({ length: 4 }, () => null)),
      );

      const newGrid = produce(initialGrid, (draft) => {
        courses.forEach((course) => {
          const occIndex = selectedOccasions?.[course.code] ?? 0;
          const occasion = course.CourseOccasion?.[occIndex];

          if (!occasion || !occasion.periods) return;

          const semesterIndex = yearAndSemesterToRelativeSemester({
            year: occasion.year,
            semester: occasion.semester,
          });

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
                if (periodBlocks[blockIndex] === null) {
                  periodBlocks[blockIndex] = course;
                } else if (periodBlocks[blockIndex]?.code !== course.code) {
                  // Conflict! Add to the end of the periodBlocks to avoid silent overwrite
                  periodBlocks.push(course);
                }
              }
            }
          }
        });
      });

      return newGrid;
    },
    [yearAndSemesterToRelativeSemester],
  );
};
