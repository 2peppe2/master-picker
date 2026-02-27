import { userPreferencesAtom } from "../UserPreferences";
import { Course } from "@/app/dashboard/page";
import { atomWithImmer } from "jotai-immer";
import { ScheduleGrid } from "./types";
import { atom } from "jotai";
import { SemesterOption } from "../filter/types";

//TODO: Make a help function to see if it is a block that is from wildstart
export const WILDCARD_BLOCK_START = 4;

export const scheduleAtoms = {
  /**
   * Main schedule grid storing all courses across semesters, periods, and blocks.
   * Structure: [semester][period][block] where each slot contains a Course or null.
   * Uses atomWithImmer for efficient immutable updates.
   *
   * @example
   * // Subscribe to schedule changes
   * const schedules = useAtomValue(schedulesAtom);
   *
   * // Or update directly (not recommended - use mutators instead)
   * const setSchedules = useSetAtom(schedulesAtom);
   */
  schedulesAtom: atomWithImmer<ScheduleGrid>(
    Array.from({ length: 10 }, () =>
      Array.from({ length: 2 }, () => Array.from({ length: 4 }, () => null)),
    ),
  ),

  /**
   * Set of semester indices that should be visible in the UI.
   * Defaults to showing semesters 7, 8, and 9.
   *
   * @example
   * // Read visibility state (no re-render on schedule changes!)
   * const shownSemester = useAtomValue(shownSemesterAtom);
   *
   * // Update visibility
   * const setShownSemester = useSetAtom(shownSemesterAtom);
   * setShownSemester(5);
   */
  shownSemesterAtom: atom<number | null>(7),

  /**
   * Currently dragged course during drag-and-drop operations.
   * Null when no drag is in progress.
   *
   * @example
   * // Subscribe to drag state (no re-render on schedule changes!)
   * const draggedCourse = useAtomValue(draggedCourseAtom);
   *
   * // Update drag state
   * const setDraggedCourse = useSetAtom(draggedCourseAtom);
   * setDraggedCourse(course);
   */
  draggedCourseAtom: atom<Course | null>(null),

  /**
   * Derived atom: Computes all unique courses currently in the schedule.
   * Only recalculates when schedulesAtom changes.
   * Prevents duplicate courses by using a Map keyed by course code.
   *
   * @example
   * // Subscribe to course list (only re-renders when courses change, not positions!)
   * const selectedCourses = useAtomValue(selectedCoursesAtom);
   */
  selectedCoursesAtom: atom((get) => {
    const schedules = get(scheduleAtoms.schedulesAtom);
    const uniqueMap = new Map<string, Course>();

    for (const schedule of schedules) {
      for (const period of schedule) {
        for (const block of period) {
          if (block) uniqueMap.set(block.code, block);
        }
      }
    }
    return Array.from(uniqueMap.values());
  }),

  /**
   * Derived atom: Computes courses within the master's degree period.
   * Only recalculates when schedulesAtom or userPreferencesAtom changes.
   * Used for tracking master's program requirements.
   *
   * @example
   * // Subscribe to master's courses (no re-render on bachelor course changes!)
   * const masterCourses = useAtomValue(selectedMasterCoursesAtom);
   */
  selectedMasterCoursesAtom: atom((get) => {
    const { masterPeriod } = get(userPreferencesAtom);
    const schedules = get(scheduleAtoms.schedulesAtom);
    const uniqueMap = new Map<string, Course>();

    for (
      let semester = masterPeriod.start - 1;
      semester < masterPeriod.end;
      ++semester
    ) {
      for (const period of schedules[semester]) {
        for (const block of period) {
          if (block) uniqueMap.set(block.code, block);
        }
      }
    }
    return Array.from(uniqueMap.values());
  }),
};
