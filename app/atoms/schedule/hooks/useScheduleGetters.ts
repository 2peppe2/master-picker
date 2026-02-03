import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { scheduleAtoms, WILDCARD_BLOCK_START } from "../atoms";
import { userPreferencesAtom } from "../../UserPreferences";
import { Course, CourseOccasion } from "@/app/(main)/page";
import { useCallback, useMemo } from "react";
import { useAtomCallback } from "jotai/utils";
import {
  CheckWildcardExpansionArgs,
  FindMatchingOccasionArgs,
  GetOccasionCollisionsArgs,
  GetSlotBlocksArgs,
  GetSlotCourseArgs,
  GetSlotPeriodsArgs,
  HasMatchingOccasionArgs,
} from "../types";

/**
 * Hook providing all state query functions.
 * These functions read from atoms internally without causing component re-renders.
 *
 * **Use this when you need to query state imperatively (e.g., in event handlers).**
 *
 * @example
 * ```ts
 * const { getSlotCourse, getOccasionCollisions } = useScheduleGetters();
 *
 * // In an event handler
 * const handleClick = () => {
 *   const course = getSlotCourse({ semester: 0, period: 1, block: 1 });
 *   console.log(course);
 * };
 * ```
 */
export const useScheduleGetters = () => {
  /**
   * Retrieves the course (or null) at a specific slot.
   * Uses 1-based indexing for period and block.
   */
  const getSlotCourse = useAtomCallback(
    useCallback((get, _set, { block, period, semester }: GetSlotCourseArgs) => {
      const schedules = get(scheduleAtoms.schedulesAtom);
      return schedules[semester][period - 1][block - 1];
    }, []),
  );

  /**
   * Retrieves all blocks in a specific period of a semester.
   * Returns array of Course | null.
   */
  const getSlotBlocks = useAtomCallback(
    useCallback((get, _set, { semester, period }: GetSlotBlocksArgs) => {
      const schedules = get(scheduleAtoms.schedulesAtom);
      return schedules[semester][period - 1];
    }, []),
  );

  /**
   * Retrieves all periods in a semester.
   * Returns 2D array: [period][block].
   */
  const getSlotPeriods = useAtomCallback(
    useCallback((get, _set, { semester }: GetSlotPeriodsArgs) => {
      const schedules = get(scheduleAtoms.schedulesAtom);
      return schedules[semester];
    }, []),
  );

  /**
   * Checks if a course has an occasion matching specific periods and blocks.
   * Used for validation before adding courses.
   */
  const hasMatchingOccasion = useCallback(
    ({ blocks, course, periods }: HasMatchingOccasionArgs) => {
      return course.CourseOccasion.some((occasion) => {
        return occasion.periods.some((occPeriod) => {
          const isWildcardCourse = occPeriod.blocks.length === 0;
          const isCorrectPeriod = periods.includes(occPeriod.period);
          const isCorrectBlock = occPeriod.blocks.some((block) =>
            blocks.includes(block),
          );
          return isCorrectPeriod && (isCorrectBlock || isWildcardCourse);
        });
      });
    },
    [],
  );

  /**
   * Finds a course occasion that matches specific year, semester, period, and block.
   * Returns null if no match found.
   * Handles both standard courses (with block lists) and wildcard courses.
   */
  const findMatchingOccasion = useCallback(
    ({
      course,
      year,
      semester,
      period,
      block,
    }: FindMatchingOccasionArgs): CourseOccasion | null => {
      const occasion = course.CourseOccasion.find((occ) => {
        if (occ.year !== year || occ.semester !== semester) return false;

        return occ.periods.some((p) => {
          if (p.period !== period) return false;

          // Standard course - check if block is in the list
          if (p.blocks.length > 0) {
            return p.blocks.includes(block);
          }

          // Wildcard course - must be in wildcard area
          if (p.blocks.length === 0) {
            return block > WILDCARD_BLOCK_START;
          }

          return false;
        });
      });

      return occasion ?? null;
    },
    [],
  );

  /**
   * Finds all courses that would collide with adding the given occasion.
   * Checks each block specified in the occasion's periods.
   * Returns array of colliding courses.
   */
  const getOccasionCollisions = useAtomCallback(
    useCallback((get, _set, { occasion }: GetOccasionCollisionsArgs) => {
      const schedules = get(scheduleAtoms.schedulesAtom);
      const { startingYear } = get(userPreferencesAtom);

      const collisions: Course[] = [];
      const relativeYear = yearAndSemesterToRelativeSemester(
        startingYear,
        occasion.year,
        occasion.semester,
      );

      for (const period of occasion.periods) {
        for (const block of period.blocks) {
          const slot = schedules[relativeYear][period.period - 1][block - 1];
          if (slot) {
            collisions.push(slot);
          }
        }
      }
      return collisions;
    }, []),
  );

  /**
   * Checks if adding an occasion would require expanding wildcard blocks.
   * Returns true if all wildcard slots in the occasion's periods are full.
   */
  const checkWildcardExpansion = useAtomCallback(
    useCallback((get, _set, { occasion }: CheckWildcardExpansionArgs) => {
      const schedules = get(scheduleAtoms.schedulesAtom);
      const { startingYear } = get(userPreferencesAtom);

      const semesterIndex = yearAndSemesterToRelativeSemester(
        startingYear,
        occasion.year,
        occasion.semester,
      );

      return occasion.periods.some((period) => {
        if (period.period === 0) return false;
        const periodIndex = period.period - 1;
        const periodBlocks = schedules[semesterIndex]?.[periodIndex];

        if (!periodBlocks) return false;
        if (period.blocks.length !== 0) return false;

        // Check if all wildcard slots are full
        for (let i = WILDCARD_BLOCK_START; i < periodBlocks.length; i++) {
          if (periodBlocks[i] === null) {
            return false;
          }
        }

        return true;
      });
    }, []),
  );

  return useMemo(
    () => ({
      checkWildcardExpansion,
      hasMatchingOccasion,
      findMatchingOccasion,
      getSlotBlocks,
      getSlotPeriods,
      getSlotCourse,
      getOccasionCollisions,
    }),
    [
      checkWildcardExpansion,
      hasMatchingOccasion,
      findMatchingOccasion,
      getSlotBlocks,
      getSlotPeriods,
      getSlotCourse,
      getOccasionCollisions,
    ],
  );
};
