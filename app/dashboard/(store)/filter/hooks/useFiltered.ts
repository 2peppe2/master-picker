"use client";

import { useCourseTranslate } from "@/common/components/translate/hooks/useCourseTranslate";
import { useScheduleGetters } from "../../schedule/hooks/useScheduleGetters";
import { useToRelativeSemester } from "@/common/hooks/useToRelativeSemester";
import { useCallback, useDeferredValue, useMemo } from "react";
import { preferenceAtoms } from "../../preferences/atoms";
import { Course } from "@/app/dashboard/page";
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
  const showBachelorYears = useAtomValue(preferenceAtoms.showBachelorYearsAtom);
  const masterPeriod = useAtomValue(preferenceAtoms.masterPeriodAtom);
  const yearAndSemesterToRelativeSemester = useToRelativeSemester();
  const { hasMatchingOccasion } = useScheduleGetters();
  const translateCourse = useCourseTranslate();

  const search = useAtomValue(filterAtoms.searchAtom);
  const levels = useAtomValue(filterAtoms.levelsAtom);
  const blocks = useAtomValue(filterAtoms.blocksAtom);
  const periods = useAtomValue(filterAtoms.periodsAtom);
  const masters = useAtomValue(filterAtoms.mastersAtom);
  const semesters = useAtomValue(filterAtoms.semestersAtom);
  const mainFields = useAtomValue(filterAtoms.mainFieldsAtom);

  const filterObject = useMemo(
    () => ({
      search,
      masters,
      blocks,
      periods,
      semesters,
      levels,
      mainFields,
    }),
    [search, masters, blocks, periods, semesters, levels, mainFields],
  );

  const deferredFilters = useDeferredValue(filterObject);

  const filterOutByTerm = useCallback(
    (term: string, course: Course) => {
      if (!term) return false;

      const searchTerm = term.toLowerCase();
      const courseCode = course.code.toLowerCase();
      const examiner = course.examiner.toLowerCase();
      const department = course.department.toLowerCase();
      const courseName = translateCourse(course.name).toLowerCase();

      return (
        !courseName.includes(searchTerm) &&
        !courseCode.includes(searchTerm) &&
        !department.includes(searchTerm) &&
        !examiner.includes(searchTerm)
      );
    },
    [translateCourse],
  );

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

  const filterOutByMainFields = useCallback(
    (selectedFields: string[], course: Course) => {
      if (!selectedFields || selectedFields.length === 0) {
        return false;
      }

      return !course.mainField.some((field) => selectedFields.includes(field));
    },
    [],
  );

  const filterOutBySemesters = useCallback(
    (selectedSemesters: number[], course: Course) => {
      if (!selectedSemesters || selectedSemesters.length === 0) {
        return false;
      }

      const matchesAnySemester = course.CourseOccasion.some((occasion) => {
        const relativeSemester = yearAndSemesterToRelativeSemester({
          year: occasion.year,
          semester: occasion.semester,
        });

        const currentCourseSemester = (relativeSemester + 1).toString();
        return selectedSemesters.some(
          (s) => s.toString() === currentCourseSemester,
        );
      });

      return !matchesAnySemester;
    },
    [yearAndSemesterToRelativeSemester],
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
        const relativeSemester = yearAndSemesterToRelativeSemester({
          year: occasion.year,
          semester: occasion.semester,
        });

        const currentSemester = relativeSemester + 1;
        return currentSemester >= minPeriod && currentSemester <= maxPeriod;
      });

      return !matchesAnySemester;
    },
    [yearAndSemesterToRelativeSemester],
  );

  return useMemo(
    () =>
      courses.filter((course) => {
        if (course.code.startsWith("custom_")) {
          if (filterOutByTerm(deferredFilters.search, course)) {
            return false;
          }
          return true;
        }

        if (filterOutBySemesters(deferredFilters.semesters, course)) {
          return false;
        }

        if (filterOutByLevels(deferredFilters.levels, course)) {
          return false;
        }

        if (filterOutByMasters(deferredFilters.masters, course)) {
          return false;
        }

        if (filterOutByMainFields(deferredFilters.mainFields, course)) {
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
      filterOutByMainFields,
      filterOutBachelors,
      showBachelorYears,
      masterPeriod,
      filterOutByPeriodsAndBlocks,
      filterOutByTerm,
    ],
  );
};
