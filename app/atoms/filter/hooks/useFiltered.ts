"use client";

import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { useScheduleGetters } from "../../schedule/hooks/useScheduleGetters";
import { useCallback, useDeferredValue, useMemo } from "react";
import { userPreferencesAtom } from "../../UserPreferences";
import { Course } from "../../../dashboard/page";
import { filterAtoms } from "../atoms";
import { useAtomValue } from "jotai";

interface MasterPeriod {
  start: number;
  end: number;
}

interface UseFilteredArgs {
  courses: Course[];
}

export const useFiltered = ({ courses }: UseFilteredArgs) => {
  const { startingYear, showBachelorYears, masterPeriod } =
    useAtomValue(userPreferencesAtom);
  const { hasMatchingOccasion } = useScheduleGetters();

  const search = useAtomValue(filterAtoms.searchAtom);
  const masters = useAtomValue(filterAtoms.mastersAtom);
  const blocks = useAtomValue(filterAtoms.blocksAtom);
  const periods = useAtomValue(filterAtoms.periodsAtom);
  const semesters = useAtomValue(filterAtoms.semestersAtom);
  const levels = useAtomValue(filterAtoms.levelsAtom);

  const filterObject = useMemo(
    () => ({
      search,
      masters,
      blocks,
      periods,
      semesters,
      levels,
    }),
    [search, masters, blocks, periods, semesters, levels],
  );

  const deferredFilters = useDeferredValue(filterObject);

  const filterOutByTerm = useCallback((term: string, course: Course) => {
    if (!term) return false;

    const searchTerm = term.toLowerCase();
    const courseName = course.name.toLowerCase();
    const courseCode = course.code.toLowerCase();
    const examiner = course.examiner.toLowerCase();
    const department = course.department.toLowerCase();
    const mainFields = course.mainField.join(" ").toLowerCase();

    return (
      !courseName.includes(searchTerm) &&
      !courseCode.includes(searchTerm) &&
      !department.includes(searchTerm) &&
      !mainFields.includes(searchTerm) &&
      !examiner.includes(searchTerm)
    );
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

  const filterOutByLevels = useCallback((levels: string[], course: Course) => {
    if (!levels || levels.length === 0) return false;

    return !levels.some((level) =>
      course.level.toLowerCase().includes(level.toLowerCase()),
    );
  }, []);

  const filterOutBachelors = useCallback(
    (
      showBachelorYears: boolean,
      masterPeriod: MasterPeriod,
      course: Course,
    ) => {
      const minPeriod = showBachelorYears ? 1 : masterPeriod.start;
      const maxPeriod = masterPeriod.end;

      const matchesAnySemester = course.CourseOccasion.some((occasion) => {
        const relativeSemester = yearAndSemesterToRelativeSemester(
          startingYear,
          occasion.year,
          occasion.semester,
        );

        const currentSemester = relativeSemester + 1;
        return currentSemester >= minPeriod && currentSemester <= maxPeriod;
      });

      return !matchesAnySemester;
    },
    [startingYear],
  );

  return useMemo(
    () =>
      courses.filter((course) => {
        if (filterOutBySemesters(deferredFilters.semesters, course)) {
          return false;
        }

        if (filterOutByLevels(deferredFilters.levels, course)) {
          return false;
        }

        if (filterOutByMasters(deferredFilters.masters, course)) {
          return false;
        }

        if (filterOutBachelors(showBachelorYears, masterPeriod, course)) {
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
      filterOutBySemesters,
      deferredFilters,
      filterOutByLevels,
      filterOutByMasters,
      filterOutBachelors,
      showBachelorYears,
      masterPeriod,
      filterOutByPeriodsAndBlocks,
      filterOutByTerm,
    ],
  );
};
