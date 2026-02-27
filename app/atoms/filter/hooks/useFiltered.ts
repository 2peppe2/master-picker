import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { useScheduleGetters } from "../../schedule/hooks/useScheduleGetters";
import { useCallback, useDeferredValue, useMemo } from "react";
import { userPreferencesAtom } from "../../UserPreferences";
import { Course } from "../../../dashboard/page";
import { SemesterOption } from "../types";
import { filterAtoms } from "../atoms";
import { useAtomValue } from "jotai";

interface UseFilteredArgs {
  courses: Course[];
}

export const useFiltered = ({ courses }: UseFilteredArgs) => {
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const { hasMatchingOccasion } = useScheduleGetters();

  const search = useAtomValue(filterAtoms.searchAtom);
  const master = useAtomValue(filterAtoms.masterAtom);
  const blocks = useAtomValue(filterAtoms.blocksAtom);
  const periods = useAtomValue(filterAtoms.periodsAtom);
  const semester = useAtomValue(filterAtoms.semesterAtom);

  const deferredFilters = useDeferredValue({
    search,
    master,
    blocks,
    periods,
    semester,
  });

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

  return useMemo(
    () =>
      courses.filter((course) => {
        if (filterOutBySemester(deferredFilters.semester, course)) {
          return false;
        }

        if (filterOutByMaster(deferredFilters.master, course)) {
          return false;
        }

        if (
          filterOutByPeriodsAndBlocks(
            deferredFilters.periods,
            deferredFilters.blocks,
            course,
          )
        ) {
          return false;
        }

        if (filterOutByTerm(deferredFilters.search, course)) {
          return false;
        }

        return true;
      }),
    [
      courses,
      deferredFilters,
      filterOutBySemester,
      filterOutByMaster,
      filterOutByPeriodsAndBlocks,
      filterOutByTerm,
    ],
  );
};
