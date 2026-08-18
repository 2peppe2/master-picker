"use client";

import { useToRelativeSemester } from "@/common/hooks/useToRelativeSemester";
import type { Course, CourseOccasion } from "@/common/types";
import { useAtomCallback } from "jotai/utils";
import { useCallback } from "react";
import { scheduleGridAtom, WILDCARD_BLOCK_START } from "../atoms";
import type {
  CheckWildcardExpansionArgs,
  FindMatchingOccasionArgs,
  GetOccasionCollisionsArgs,
  GetSlotBlocksArgs,
  GetSlotCourseArgs,
  HasMatchingOccasionArgs,
} from "../types";

export const useSlotCourse = () =>
  useAtomCallback(
    useCallback(
      (get, _set, { block, period, semester }: GetSlotCourseArgs) =>
        get(scheduleGridAtom)[semester][period - 1][block - 1],
      [],
    ),
  );

export const useSlotBlocks = () =>
  useAtomCallback(
    useCallback(
      (get, _set, { semester, period }: GetSlotBlocksArgs) =>
        get(scheduleGridAtom)[semester][period - 1],
      [],
    ),
  );

export const useHasMatchingOccasion = () =>
  useCallback(
    ({ blocks, course, periods }: HasMatchingOccasionArgs) =>
      course.CourseOccasion.some((occasion) =>
        occasion.periods.some(
          (occPeriod) =>
            periods.includes(occPeriod.period) &&
            (occPeriod.blocks.length === 0 ||
              occPeriod.blocks.some((block) => blocks.includes(block))),
        ),
      ),
    [],
  );

export const useFindMatchingOccasion = () =>
  useCallback(
    ({
      course,
      year,
      semester,
      period,
      block,
    }: FindMatchingOccasionArgs): CourseOccasion | null =>
      course.CourseOccasion.find(
        (occasion) =>
          occasion.year === year &&
          occasion.semester === semester &&
          occasion.periods.some(
            (value) =>
              value.period === period &&
              (value.blocks.length
                ? value.blocks.includes(block)
                : block > WILDCARD_BLOCK_START),
          ),
      ) ?? null,
    [],
  );

export const useOccasionCollisions = () => {
  const toRelativeSemester = useToRelativeSemester();
  return useAtomCallback(
    useCallback(
      (get, _set, { occasion }: GetOccasionCollisionsArgs) => {
        const grid = get(scheduleGridAtom);
        const collisions = new Set<Course>();
        const semester = toRelativeSemester({
          year: occasion.year,
          semester: occasion.semester,
        });
        occasion.periods.forEach(({ period, blocks }) =>
          blocks.forEach((block) => {
            const course = grid[semester]?.[period - 1]?.[block - 1];
            if (course) collisions.add(course);
          }),
        );
        return [...collisions];
      },
      [toRelativeSemester],
    ),
  );
};

export const useWildcardExpansion = () => {
  const toRelativeSemester = useToRelativeSemester();
  return useAtomCallback(
    useCallback(
      (get, _set, { occasion }: CheckWildcardExpansionArgs) => {
        const grid = get(scheduleGridAtom);
        const semester = toRelativeSemester({
          year: occasion.year,
          semester: occasion.semester,
        });
        return occasion.periods.some(({ period, blocks }) => {
          const slots = grid[semester]?.[period - 1];
          return (
            period > 0 &&
            blocks.length === 0 &&
            Boolean(slots) &&
            slots!.slice(WILDCARD_BLOCK_START).every((slot) => slot !== null)
          );
        });
      },
      [toRelativeSemester],
    ),
  );
};
