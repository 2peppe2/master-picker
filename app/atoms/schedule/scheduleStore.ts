import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { userPreferencesAtom } from "../UserPreferences";
import { atom, useAtom, useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import { Course } from "../../dashboard/page";
import { produce } from "immer";
import {
  AddCourseArgs,
  GetSlotBlocksArgs,
  GetSlotCourseArgs,
  GetSlotPeriodsArgs,
  GetOccasionCollisionsArgs,
  RemoveCourseArgs,
  ToggleShownSemesterArgs,
  AddBlockToSemesterArgs,
} from "./types";

export type Slot = Course | null;
export type ScheduleGrid = Slot[][][]; // [semester][period][block]

interface ScheduleStore {
  state: {
    schedules: ScheduleGrid;
    shownSemesters: Set<number>;
    selectedCourses: Course[];
    selectedMasterCourses: Course[];
  };

  mutators: {
    addCourse: (args: AddCourseArgs) => void;
    removeCourse: (args: RemoveCourseArgs) => void;
    addBlockToSemester: (args: AddBlockToSemesterArgs) => void;
    toggleShownSemester: (args: ToggleShownSemesterArgs) => void;
  };

  getters: {
    getSlotCourse: (args: GetSlotCourseArgs) => Slot;
    getSlotBlocks: (args: GetSlotBlocksArgs) => Slot[];
    getSlotPeriods: (args: GetSlotPeriodsArgs) => Slot[][];
    getOccasionCollisions: (args: GetOccasionCollisionsArgs) => Course[];
  };
}

const schedulesAtom = atom<ScheduleGrid>(
  Array.from({ length: 9 }, () =>
    Array.from({ length: 2 }, () => Array.from({ length: 4 }, () => null)),
  ),
);

const shownSemestersAtom = atom<Set<number>>(new Set([7, 8, 9]));

export const useScheduleStore = (): ScheduleStore => {
  const { startingYear, masterPeriod } = useAtomValue(userPreferencesAtom);
  const [shownSemesters, setShownSemesters] = useAtom(shownSemestersAtom);
  const [schedules, setSchedules] = useAtom(schedulesAtom);

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

  const addCourse = useCallback(
    ({ course, occasion }: AddCourseArgs) => {
      setSchedules((prev) =>
        produce(prev, (draft) => {
          const relativeYear = yearAndSemesterToRelativeSemester(
            startingYear,
            occasion.year,
            occasion.semester,
          );
          for (const period of occasion.periods) {
            for (const block of period.blocks) {
              draft[relativeYear][period.period - 1][block - 1] = course;
            }
          }
          return draft;
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

  return {
    state: {
      schedules,
      shownSemesters,
      selectedCourses,
      selectedMasterCourses,
    },
    mutators: {
      addCourse,
      removeCourse,
      addBlockToSemester,
      toggleShownSemester,
    },
    getters: {
      getSlotBlocks,
      getSlotPeriods,
      getSlotCourse,
      getOccasionCollisions,
    },
  };
};
