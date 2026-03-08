"use client";

import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { useScheduleGetters } from "../../schedule/hooks/useScheduleGetters";
import { useCallback, useDeferredValue, useMemo } from "react";
import { userPreferencesAtom } from "../../UserPreferences";
import { Course } from "../../../dashboard/page";
import { filterAtoms } from "../atoms";
import { useAtomValue } from "jotai";

interface UseFilteredArgs {
  courses: Course[];
}

export const useFiltered = ({ courses }: UseFilteredArgs) => {
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const { hasMatchingOccasion } = useScheduleGetters();

  const search = useAtomValue(filterAtoms.searchAtom);
  const masters = useAtomValue(filterAtoms.mastersAtom);
  const blocks = useAtomValue(filterAtoms.blocksAtom);
  const periods = useAtomValue(filterAtoms.periodsAtom);
  const semesters = useAtomValue(filterAtoms.semestersAtom);

  const filterObject = useMemo(
    () => ({
      search,
      masters,
      blocks,
      periods,
      semesters,
    }),
    [search, masters, blocks, periods, semesters],
  );

  const deferredFilters = useDeferredValue(filterObject);

  const filterOutByTerm = useCallback((term: string, course: Course) => {
    if (!term) return false;
    const searchTerm = term.toLowerCase();
    const courseName = course.name.toLowerCase();
    const courseCode = course.code.toLowerCase();
    return !courseName.includes(searchTerm) && !courseCode.includes(searchTerm);
  }, []);

  const filterOutByMasters = useCallback(
    (selectedMasters: string[], course: Course) => {
      if (!selectedMasters || selectedMasters.length === 0) {
        return false;
      }

      const courseMasters = course.CourseMaster.map((cm) => cm.master);

      return !courseMasters.some((cm) =>
        selectedMasters.some((selected) => cm.includes(selected)),
      );
    },
    [],
  );

  const filterOutBySemesters = useCallback(
    (selectedSemesters: number[], course: Course) => {
      if (!selectedSemesters || selectedSemesters.length === 0) {
        return false;
      }

      const matchesAnySemester = course.CourseOccasion.some((occasion) => {
        const relativeSemester = yearAndSemesterToRelativeSemester(
          startingYear,
          occasion.year,
          occasion.semester,
        );

        const currentCourseSemester = (relativeSemester + 1).toString();
        return selectedSemesters.some(
          (s) => s.toString() === currentCourseSemester,
        );
      });

      return !matchesAnySemester;
    },
    [startingYear],
  );

  const filterOutByPeriods = useCallback(
    (periods: number[], course: Course) => {
      if (!periods || periods.length === 0) return false;

      const occasionPeriods = course.CourseOccasion.flatMap(
        (occasion) => occasion.periods,
      );

      if (occasionPeriods.length === 0) return false;

      return !occasionPeriods.some(({ period }) => periods.includes(period));
    },
    [],
  );

  const filterOutByBlocks = useCallback((blocks: number[], course: Course) => {
    if (!blocks || blocks.length === 0) return false;

    const occasionBlocks = course.CourseOccasion.flatMap((occasion) =>
      occasion.periods.flatMap((period) => period.blocks),
    );

    if (occasionBlocks.length === 0) return false;

    return !occasionBlocks.some((block) => blocks.includes(block));
  }, []);

  const filterOutByPeriodsAndBlocks = useCallback(
    (periods: number[], blocks: number[], course: Course) => {
      const hasPeriods = periods && periods.length > 0;
      const hasBlocks = blocks && blocks.length > 0;

      if (!hasPeriods && hasBlocks) return filterOutByBlocks(blocks, course);
      if (hasPeriods && !hasBlocks) return filterOutByPeriods(periods, course);
      if (!hasPeriods && !hasBlocks) return false;

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
        if (filterOutBySemesters(deferredFilters.semesters, course))
          return false;
        if (filterOutByMasters(deferredFilters.masters, course)) return false;
        if (
          filterOutByPeriodsAndBlocks(
            deferredFilters.periods,
            deferredFilters.blocks,
            course,
          )
        )
          return false;
        if (filterOutByTerm(deferredFilters.search, course)) return false;

        return true;
      }),
    [
      courses,
      deferredFilters,
      filterOutBySemesters,
      filterOutByMasters,
      filterOutByPeriodsAndBlocks,
      filterOutByTerm,
    ],
  );
};
