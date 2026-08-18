"use client";

import { useCourseTranslate } from "@/common/components/translate/hooks/useCourseTranslate";
import { useToRelativeSemester } from "@/common/hooks/useToRelativeSemester";
import type { Course } from "@/common/types";
import { useAtomValue } from "jotai";
import { useDeferredValue, useMemo } from "react";
import {
  masterPeriodAtom,
  showBachelorYearsAtom,
} from "../../preferences/atoms";
import { useHasMatchingOccasion } from "../../schedule/hooks/useScheduleQueries";
import { filterStateAtom } from "../atoms";
import { courseMatchesFilters } from "../domain";

export const useFiltered = ({ courses }: { courses: Course[] }) => {
  const showBachelorYears = useAtomValue(showBachelorYearsAtom);
  const masterPeriod = useAtomValue(masterPeriodAtom);
  const filters = useDeferredValue(useAtomValue(filterStateAtom));
  const toRelativeSemester = useToRelativeSemester();
  const translateCourseName = useCourseTranslate();
  const hasMatchingOccasion = useHasMatchingOccasion();

  return useMemo(
    () =>
      courses.filter((course) =>
        courseMatchesFilters(course, filters, {
          showBachelorYears,
          masterPeriod,
          translateCourseName,
          toRelativeSemester,
          hasMatchingOccasion,
        }),
      ),
    [
      courses,
      filters,
      hasMatchingOccasion,
      masterPeriod,
      showBachelorYears,
      toRelativeSemester,
      translateCourseName,
    ],
  );
};
