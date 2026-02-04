import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { scheduleAtoms, WILDCARD_BLOCK_START } from "../atoms";
import { userPreferencesAtom } from "../../UserPreferences";
import { Course } from "@/app/dashboard/page";
import { useAtomCallback } from "jotai/utils";
import { useCallback, useMemo } from "react";
import {
  AddBlockToSemesterArgs,
  AddCourseByButtonArgs,
  AddCourseByDropArgs,
  DeleteBlockFromSemesterArgs,
  RemoveCourseArgs,
  ToggleShownSemesterArgs,
} from "../types";

/**
 * Hook providing all state mutation functions without subscribing to state.
 * These functions have stable references and won't cause re-renders.
 *
 * **Use this when you only need to modify state, not read it.**
 *
 * @example
 * ```ts
 * const { addCourseByDrop, removeCourse } = useScheduleMutators();
 * ```
 */
export const useScheduleMutators = () => {
  /**
   * Sets the currently dragged course during drag operations.
   *
   * **Prefer using atom directly:**
   * ```ts
   * const setDraggedCourse = useSetAtom(draggedCourseAtom);
   * ```
   */
  const setDraggedCourse = useAtomCallback(
    useCallback((get, set, course: Course | null) => {
      set(scheduleAtoms.draggedCourseAtom, course);
    }, []),
  );

  /**
   * Toggles visibility of a semester in the UI.
   * Adds the semester to shownSemesters if hidden, removes if shown.
   */
  const toggleShownSemester = useAtomCallback(
    useCallback((get, set, { semester }: ToggleShownSemesterArgs) => {
      set(scheduleAtoms.shownSemestersAtom, (prev) => {
        const next = new Set(prev);
        if (next.has(semester)) {
          next.delete(semester);
        } else {
          next.add(semester);
        }
        return next;
      });
    }, []),
  );

  /**
   * Adds a new block column to all periods in a semester.
   * Used when wildcard courses need more space.
   */
  const addBlockToSemester = useAtomCallback(
    useCallback((get, set, { semester }: AddBlockToSemesterArgs) => {
      set(scheduleAtoms.schedulesAtom, (draft) => {
        draft[semester].forEach((period) => {
          period.push(null);
        });
      });
    }, []),
  );

  /**
   * Deletes a block column from all periods in a semester.
   * Only allows deletion of wildcard blocks (index >= WILDCARD_BLOCK_START).
   */
  const deleteBlockFromSemester = useAtomCallback(
    useCallback(
      (get, set, { semester, blockIndex }: DeleteBlockFromSemesterArgs) => {
        if (blockIndex < WILDCARD_BLOCK_START) return;

        set(scheduleAtoms.schedulesAtom, (draft) => {
          draft[semester]?.forEach((periodBlocks) => {
            if (blockIndex < periodBlocks.length) {
              periodBlocks.splice(blockIndex, 1);
            }
          });
        });
      },
      [],
    ),
  );

  /**
   * Adds a course to the schedule via button click.
   * Places course in all periods/blocks specified by the occasion.
   * For wildcard courses, finds first available slot after WILDCARD_BLOCK_START.
   */
  const addCourseByButton = useAtomCallback(
    useCallback((get, set, { course, occasion }: AddCourseByButtonArgs) => {
      const startingYear = get(userPreferencesAtom).startingYear;

      set(scheduleAtoms.schedulesAtom, (draft) => {
        const semesterIndex = yearAndSemesterToRelativeSemester(
          startingYear,
          occasion.year,
          occasion.semester,
        );

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
    }, []),
  );

  /**
   * Adds a course to the schedule via drag-and-drop.
   * Similar to addCourseByButton but optimized for drop operations.
   */
  const addCourseByDrop = useAtomCallback(
    useCallback((get, set, { course, occasion }: AddCourseByDropArgs) => {
      const startingYear = get(userPreferencesAtom).startingYear;

      set(scheduleAtoms.schedulesAtom, (draft) => {
        const semesterIndex = yearAndSemesterToRelativeSemester(
          startingYear,
          occasion.year,
          occasion.semester,
        );

        if (!draft[semesterIndex]) return;

        for (const period of occasion.periods) {
          if (period.period < 1) continue;
          const periodIndex = period.period - 1;
          const periodBlocks = draft[semesterIndex][periodIndex];
          if (!periodBlocks) continue;

          if (period.blocks.length === 0) {
            // Wildcard course - find empty slot
            let placed = false;
            for (let i = WILDCARD_BLOCK_START; i < periodBlocks.length; i++) {
              if (periodBlocks[i] === null) {
                periodBlocks[i] = course;
                placed = true;
                break;
              }
            }
            if (!placed) periodBlocks.push(course);
          } else {
            // Standard course - place in specified blocks
            for (const block of period.blocks) {
              periodBlocks[block - 1] = course;
            }
          }
        }
      });
    }, []),
  );

  /**
   * Removes all instances of a course from the schedule by course code.
   * Sets all matching slots to null.
   */
  const removeCourse = useAtomCallback(
    useCallback((get, set, { courseCode }: RemoveCourseArgs) => {
      set(scheduleAtoms.schedulesAtom, (draft) => {
        draft.forEach((semester) => {
          semester.forEach((period) => {
            period.forEach((block, blockIndex) => {
              if (block?.code === courseCode) {
                period[blockIndex] = null;
              }
            });
          });
        });
      });
    }, []),
  );

  return useMemo(
    () => ({
      addCourseByButton,
      addCourseByDrop,
      removeCourse,
      addBlockToSemester,
      deleteBlockFromSemester,
      toggleShownSemester,
      setDraggedCourse,
    }),
    [
      addCourseByButton,
      addCourseByDrop,
      removeCourse,
      addBlockToSemester,
      deleteBlockFromSemester,
      toggleShownSemester,
      setDraggedCourse,
    ],
  );
};
