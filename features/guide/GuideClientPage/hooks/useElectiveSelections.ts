"use client";

import { normalizeCourse } from "@/common/courseNormalizer";
import type { Course } from "@/common/types";
import type { CourseRequirements } from "@/features/guide/types";
import { useCallback, useMemo, useState } from "react";

export const useElectiveSelections = (electiveCourses: CourseRequirements) => {
  const [selectionIds, setSelectionIds] = useState<Record<number, string[]>>({});
  const selections = useMemo<Record<number, Course[]>>(
    () =>
      electiveCourses.reduce<Record<number, Course[]>>((result, group, index) => {
        result[index] = group.courses
          .map((entry) => normalizeCourse(entry.course))
          .filter((course) => selectionIds[index]?.includes(course.code));
        return result;
      }, {}),
    [electiveCourses, selectionIds],
  );
  const selectElectiveCourses = useCallback(
    (index: number, selection: string[]) => {
      setSelectionIds((current) => ({ ...current, [index]: selection }));
    },
    [],
  );

  return {
    selectionIds,
    selections,
    selectElectiveCourses,
  };
};
