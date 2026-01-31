import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { Course, CourseOccasion } from "../../dashboard/page";
import { userPreferencesAtom } from "../UserPreferences";
import { atom, useAtom, useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import { produce } from "immer";
import {
  AddCourseByButtonArgs,
  AddCourseByDropArgs,
  GetSlotBlocksArgs,
  GetSlotCourseArgs,
  GetSlotPeriodsArgs,
  GetOccasionCollisionsArgs,
  RemoveCourseArgs,
  ToggleShownSemesterArgs,
  AddBlockToSemesterArgs,
  HasMatchingOccasionArgs,
  FindMatchingOccasionArgs,
  CheckWildcardExpansionArgs,
  DeleteBlockFromSemesterArgs,
} from "./types";

export type Slot = Course | null;
export type ScheduleGrid = Slot[][][]; // [semester][period][block]

export const WILDCARD_BLOCK_START = 4;

interface ScheduleStore {
  state: {
    draggedCourse: Course | null;
    schedules: ScheduleGrid;
    selectedCourses: Course[];
    selectedMasterCourses: Course[];
    shownSemesters: Set<number>;
  };

  mutators: {
    setDraggedCourse: (draggedCourse: Course | null) => void;
    addCourseByButton: (args: AddCourseByButtonArgs) => void;
    addCourseByDrop: (args: AddCourseByDropArgs) => void;
    removeCourse: (args: RemoveCourseArgs) => void;
    deleteBlockFromSemester: (args: DeleteBlockFromSemesterArgs) => void;
    addBlockToSemester: (args: AddBlockToSemesterArgs) => void;
    toggleShownSemester: (args: ToggleShownSemesterArgs) => void;
  };

  getters: {
    findMatchingOccasion: (
      args: FindMatchingOccasionArgs,
    ) => CourseOccasion | null;
    hasMatchingOccasion: (args: HasMatchingOccasionArgs) => boolean;
    checkWildcardExpansion: (args: CheckWildcardExpansionArgs) => boolean;
    getSlotCourse: (args: GetSlotCourseArgs) => Slot;
    getSlotBlocks: (args: GetSlotBlocksArgs) => Slot[];
    getSlotPeriods: (args: GetSlotPeriodsArgs) => Slot[][];
    getOccasionCollisions: (args: GetOccasionCollisionsArgs) => Course[];
  };
}

const schedulesAtom = atom<ScheduleGrid>(
  Array.from({ length: 10 }, () =>
    Array.from({ length: 2 }, () => Array.from({ length: 4 }, () => null)),
  ),
);

const shownSemestersAtom = atom<Set<number>>(new Set([7, 8, 9]));

const draggedCourseAtom = atom<Course | null>(null);

export const useScheduleStore = (): ScheduleStore => {
  const { startingYear, masterPeriod } = useAtomValue(userPreferencesAtom);
  const [shownSemesters, setShownSemesters] = useAtom(shownSemestersAtom);
  const [schedules, setSchedules] = useAtom(schedulesAtom);
  const [draggedCourse, setDraggedCourse] = useAtom(draggedCourseAtom);

  const selectedCourses = useMemo(() => {
    const uniqueMap = new Map<string, Course>();

    for (const schedule of schedules) {
      for (const period of schedule) {
        for (const block of period) {
          if (block) uniqueMap.set(block.code, block);
        }
      }
    }
    return Array.from(uniqueMap.values());
  }, [schedules]);

  const selectedMasterCourses = useMemo(() => {
    const uniqueMap = new Map<string, Course>();

    for (
      let semester = masterPeriod.start - 1;
      semester < masterPeriod.end - 1;
      ++semester
    ) {
      for (const period of schedules[semester]) {
        for (const block of period) {
          if (block) uniqueMap.set(block.code, block);
        }
      }
    }
    return Array.from(uniqueMap.values());
  }, [masterPeriod, schedules]);

  const hasMatchingOccasion = ({
    blocks,
    course,
    periods,
  }: HasMatchingOccasionArgs) => {
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
  };

  const toggleShownSemester = useCallback(
    ({ semester }: ToggleShownSemesterArgs) => {
      setShownSemesters((prev) => {
        const next = new Set(prev);
        if (next.has(semester)) {
          next.delete(semester);
        } else {
          next.add(semester);
        }
        return next;
      });
    },
    [setShownSemesters],
  );

  const addBlockToSemester = useCallback(
    ({ semester }: AddBlockToSemesterArgs) => {
      setSchedules((prev) =>
        produce(prev, (draft) => {
          draft[semester].forEach((period) => {
            period.push(null);
          });
        }),
      );
    },
    [setSchedules],
  );

  const deleteBlockFromSemester = useCallback(
    ({ semester, blockIndex }: DeleteBlockFromSemesterArgs) => {
      setSchedules((prev) =>
        produce(prev, (draft) => {
          if (blockIndex < WILDCARD_BLOCK_START) return;

          draft[semester]?.forEach((periodBlocks) => {
            if (blockIndex < periodBlocks.length) {
              periodBlocks.splice(blockIndex, 1);
            }
          });
        }),
      );
    },
    [setSchedules],
  );

  const addCourseByButton = useCallback(
    ({ course, occasion }: AddCourseByButtonArgs) => {
      setSchedules(
        produce((draft) => {
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
              for (const block of period.blocks) {
                const blockIndex = block - 1;
                periodBlocks[blockIndex] = course;
              }
            }
          }
        }),
      );
    },
    [setSchedules, startingYear],
  );

  const addCourseByDrop = useCallback(
    ({ course, occasion }: AddCourseByDropArgs) => {
      setSchedules(
        produce((draft) => {
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
              for (const block of period.blocks) {
                periodBlocks[block - 1] = course;
              }
            }
          }
        }),
      );
    },
    [setSchedules, startingYear],
  );

  const removeCourse = useCallback(
    ({ courseCode }: RemoveCourseArgs) => {
      setSchedules((prev) =>
        produce(prev, (draft) => {
          draft.forEach((semester) => {
            semester.forEach((period) => {
              period.forEach((block, blockIndex) => {
                if (block?.code === courseCode) {
                  period[blockIndex] = null;
                }
              });
            });
          });
        }),
      );
    },
    [setSchedules],
  );

  const getSlotCourse = useCallback(
    ({ block, period, semester }: GetSlotCourseArgs) =>
      schedules[semester][period - 1][block - 1],
    [schedules],
  );

  const getSlotBlocks = useCallback(
    ({ semester, period }: GetSlotBlocksArgs) =>
      schedules[semester][period - 1],
    [schedules],
  );

  const getSlotPeriods = useCallback(
    ({ semester }: GetSlotPeriodsArgs) => schedules[semester],
    [schedules],
  );

  const findMatchingOccasion = ({
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

        // Standard course
        if (p.blocks.length > 0) {
          return p.blocks.includes(block);
        }

        // Wildcard course
        if (p.blocks.length === 0) {
          return block > WILDCARD_BLOCK_START;
        }

        return false;
      });
    });

    return occasion ?? null;
  };

  const getOccasionCollisions = useCallback(
    ({ occasion }: GetOccasionCollisionsArgs) => {
      const collisions: Course[] = [];
      const relativeYear = yearAndSemesterToRelativeSemester(
        startingYear,
        occasion.year,
        occasion.semester,
      );
      for (const period of occasion.periods) {
        for (const block of period.blocks) {
          const slot = getSlotCourse({
            semester: relativeYear,
            period: period.period,
            block: block,
          });
          if (slot) {
            collisions.push(slot);
          }
        }
      }
      return collisions;
    },
    [getSlotCourse, startingYear],
  );

  const checkWildcardExpansion = useCallback(
    ({ occasion }: CheckWildcardExpansionArgs) => {
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

        for (let i = WILDCARD_BLOCK_START; i < periodBlocks.length; i++) {
          if (periodBlocks[i] === null) {
            return false;
          }
        }

        return true;
      });
    },
    [schedules, startingYear],
  );

  return {
    state: {
      schedules,
      shownSemesters,
      selectedCourses,
      selectedMasterCourses,
      draggedCourse,
    },
    mutators: {
      addCourseByButton,
      addCourseByDrop,
      removeCourse,
      addBlockToSemester,
      deleteBlockFromSemester,
      toggleShownSemester,
      setDraggedCourse,
    },
    getters: {
      checkWildcardExpansion,
      hasMatchingOccasion,
      findMatchingOccasion,
      getSlotBlocks,
      getSlotPeriods,
      getSlotCourse,
      getOccasionCollisions,
    },
  };
};
