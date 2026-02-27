import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { useScheduleGetters } from "../schedule/hooks/useScheduleGetters";
import { useCallback, useDeferredValue, useMemo } from "react";
import { userPreferencesAtom } from "../UserPreferences";
import { Course } from "../../dashboard/page";
import { SemesterOption } from "./types";
import { filterAtoms } from "./atoms";
import { useAtomValue } from "jotai";

export const useFiltered = (courses: Course[]) => {
  const { getSlotCourse, hasMatchingOccasion } = useScheduleGetters();
  const { startingYear } = useAtomValue(userPreferencesAtom);

  const search = useAtomValue(filterAtoms.searchAtom);
  const master = useAtomValue(filterAtoms.masterAtom);
  const blocks = useAtomValue(filterAtoms.blocksAtom);
  const periods = useAtomValue(filterAtoms.periodsAtom);
  const semester = useAtomValue(filterAtoms.semesterAtom);
  const excludeSlotConflicts = useAtomValue(
    filterAtoms.excludeSlotConflictsAtom,
  );

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

  const filterOutByPeriods = useCallback(
    (periods: number[], course: Course) => {
      if (!periods) return false;

      const occasionPeriods = course.CourseOccasion.flatMap(
        (occasion) => occasion.periods,
      );

      if (occasionPeriods.length === 0) return false;

      return !occasionPeriods.some(({ period }) => periods.includes(period));
    },
    [],
  );

  const filterOutByBlocks = useCallback((blocks: number[], course: Course) => {
    if (!blocks) return false;

    const occasionBlocks = course.CourseOccasion.flatMap((occasion) =>
      occasion.periods.flatMap((period) => period.blocks),
    );

    if (occasionBlocks.length === 0) return false;

    return !occasionBlocks.some((block) => blocks.includes(block));
  }, []);

  const filterOutByPeriodsAndBlocks = useCallback(
    (periods: number[], blocks: number[], course: Course) => {
      if (!periods && blocks) {
        return filterOutByBlocks(blocks, course);
      } else if (periods && !blocks) {
        return filterOutByPeriods(periods, course);
      }

      if (!periods && !blocks) {
        return false;
      }

      return !hasMatchingOccasion({
        blocks,
        periods,
        course,
      });
    },
    [filterOutByBlocks, filterOutByPeriods, hasMatchingOccasion],
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
