import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { useAtomValue, useSetAtom, WritableAtom } from "jotai";
import { useCallback, useDeferredValue, useMemo } from "react";
import { useScheduleStore } from "../schedule/scheduleStore";
import { userPreferencesAtom } from "../UserPreferences";
import { atomWithReset, RESET } from "jotai/utils";
import { Course } from "../../(main)/page";
import { SemesterOption } from "./types";

type ResettableAtom<T> = WritableAtom<T, [T | typeof RESET], void>;

interface FilterStore {
  atoms: {
    searchAtom: ResettableAtom<string>;
    blocksAtom: ResettableAtom<number[]>;
    periodsAtom: ResettableAtom<number[]>;
    semesterAtom: ResettableAtom<SemesterOption>;
    masterAtom: ResettableAtom<string>;
    excludeSlotConflictsAtom: ResettableAtom<boolean>;
  };

  mutators: {
    filterByTerm: (term: string) => void;
    selectMaster: (master: string) => void;
    selectBlocks: (blocks: number[]) => void;
    selectPeriods: (periods: number[]) => void;
    selectSemester: (semester: SemesterOption) => void;
    excludeSlotConflicts: (exclude: boolean) => void;

    reset: () => void;
  };
}

const searchAtom = atomWithReset<string>("");
const masterAtom = atomWithReset<string>("all");
const semesterAtom = atomWithReset<SemesterOption>("all");
const periodsAtom = atomWithReset<number[]>([1, 2]);
const blocksAtom = atomWithReset<number[]>([1, 2, 3, 4]);
const excludeSlotConflictsAtom = atomWithReset<boolean>(false);

export const useFilterStore = (): FilterStore => {
  const setExcludeSlotConflicts = useSetAtom(excludeSlotConflictsAtom);
  const setSemester = useSetAtom(semesterAtom);
  const setPeriods = useSetAtom(periodsAtom);
  const setBlocks = useSetAtom(blocksAtom);
  const setMaster = useSetAtom(masterAtom);
  const setSearch = useSetAtom(searchAtom);

  const reset = useCallback(() => {
    setSearch(RESET);
    setMaster(RESET);
    setBlocks(RESET);
    setPeriods(RESET);
    setSemester(RESET);
    setExcludeSlotConflicts(RESET);
  }, [
    setBlocks,
    setExcludeSlotConflicts,
    setMaster,
    setPeriods,
    setSearch,
    setSemester,
  ]);

  return {
    atoms: {
      masterAtom,
      searchAtom,
      blocksAtom,
      periodsAtom,
      semesterAtom,
      excludeSlotConflictsAtom,
    },
    mutators: {
      filterByTerm: setSearch,

      selectBlocks: setBlocks,
      selectPeriods: setPeriods,
      selectSemester: setSemester,

      selectMaster: setMaster,

      excludeSlotConflicts: setExcludeSlotConflicts,

      reset,
    },
  };
};

export const useFiltered = (courses: Course[]) => {
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const { atoms } = useFilterStore();
  const {
    getters: { getSlotCourse },
  } = useScheduleStore();

  const search = useAtomValue(atoms.searchAtom);
  const master = useAtomValue(atoms.masterAtom);
  const blocks = useAtomValue(atoms.blocksAtom);
  const periods = useAtomValue(atoms.periodsAtom);
  const semester = useAtomValue(atoms.semesterAtom);
  const excludeSlotConflicts = useAtomValue(atoms.excludeSlotConflictsAtom);

  const defferedSearch = useDeferredValue(search);

  const filterOutByTerm = useCallback((term: string, course: Course) => {
    if (!term) return false;

    const searchTerm = term.toLowerCase();
    const courseName = course.name.toLowerCase();
    const courseCode = course.code.toLowerCase();
    return !courseName.includes(searchTerm) && !courseCode.includes(searchTerm);
  }, []);

  const filterOutByMaster = useCallback((master: string, course: Course) => {
    // If we have all selected, this means all courses not only
    // master courses. Might be changed in the future.
    if (master === "all") {
      return false;
    }

    const masters = course.CourseMaster.map(
      (courseMaster) => courseMaster.master,
    );

    return !masters.some((courseMaster) => courseMaster.includes(master));
  }, []);

  const filterOutBySemester = useCallback(
    (semester: SemesterOption, course: Course) => {
      if (semester === "all") {
        return false;
      }

      const relativeSemester = yearAndSemesterToRelativeSemester(
        startingYear,
        course.CourseOccasion[0].year,
        course.CourseOccasion[0].semester,
      );

      if (semester != relativeSemester + 1) {
        return true;
      }
    },
    [startingYear],
  );

  const filterOutByPeriodsAndBlocks = useCallback(
    (periods: number[], blocks: number[], course: Course) => {
      if (!periods || !blocks) return false;

      const occasionPeriods = course.CourseOccasion.flatMap(
        (occasion) => occasion.periods,
      );

      if (occasionPeriods.length === 0) return false;

      // Check if any selected period contains any selected block
      return !occasionPeriods.some(
        ({ period, blocks: periodBlocks }) =>
          periods.includes(period) &&
          periodBlocks.some((block) => blocks.includes(block)),
      );
    },
    [],
  );

  const filterOutBySlots = useCallback(
    (excludeSlotConflicts: boolean, course: Course) => {
      if (!excludeSlotConflicts) return;

      return course.CourseOccasion.some((occasion) =>
        occasion.periods.some(({ period, blocks }) =>
          blocks.some((block) => {
            const relativeSemester = yearAndSemesterToRelativeSemester(
              startingYear,
              occasion.year,
              occasion.semester,
            );
            if (getSlotCourse({ block, period, semester: relativeSemester })) {
              return true;
            }
          }),
        ),
      );
    },
    [getSlotCourse, startingYear],
  );

  return useMemo(
    () =>
      courses.filter((course) => {
        if (filterOutBySemester(semester, course)) {
          return false;
        }

        if (filterOutByMaster(master, course)) {
          return false;
        }

        if (filterOutByPeriodsAndBlocks(periods, blocks, course)) {
          return false;
        }

        if (filterOutByTerm(defferedSearch, course)) {
          return false;
        }

        if (filterOutBySlots(excludeSlotConflicts, course)) {
          return false;
        }

        return true;
      }),
    [
      courses,
      filterOutBySemester,
      semester,
      filterOutByMaster,
      master,
      filterOutByPeriodsAndBlocks,
      periods,
      blocks,
      filterOutByTerm,
      defferedSearch,
      filterOutBySlots,
      excludeSlotConflicts,
    ],
  );
};
