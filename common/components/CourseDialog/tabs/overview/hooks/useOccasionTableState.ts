"use client";

import { useToRelativeSemester } from "@/common/hooks/useToRelativeSemester";
import { sortCourseOccasionsByPreferredSemesters } from "@/common/courseOccasionOrdering";
import { Course, CourseOccasion } from "@/common/types";
import { useMemo, useState } from "react";
import type { OccasionActions } from "../../../types";

interface UseOccasionTableStateArgs {
  course: Course;
  preferredSemesters?: number[];
  occasionActions?: OccasionActions;
}

export const useOccasionTableState = ({
  course,
  preferredSemesters,
  occasionActions,
}: UseOccasionTableStateArgs) => {
  const [selectedOccasion, setSelectedOccasion] =
    useState<CourseOccasion | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const toRelativeSemester = useToRelativeSemester();
  const occasions = useMemo(
    () =>
      sortCourseOccasionsByPreferredSemesters({
        occasions: course.CourseOccasion,
        preferredSemesters: preferredSemesters ?? [],
        toRelativeSemester,
      }),
    [course.CourseOccasion, preferredSemesters, toRelativeSemester],
  );

  const getOtherCourseCollisions = (occasion: CourseOccasion) =>
    (occasionActions?.getCollisions(occasion) ?? []).filter(
      (collision) => collision.code !== course.code,
    );

  const handleAdd = (occasion: CourseOccasion) => {
    if (getOtherCourseCollisions(occasion).length > 0) {
      setSelectedOccasion(occasion);
      setAlertOpen(true);
      return;
    }

    occasionActions?.onAdd(course, occasion);
  };

  return {
    alertOpen,
    occasions,
    selectedOccasion,
    setAlertOpen,
    setSelectedOccasion,
    getOtherCourseCollisions,
    handleAdd,
    handleResolveConflict: (type: "replace" | "extra") => {
      if (!selectedOccasion) return;
      occasionActions?.onResolve(
        {
          course,
          occasion: selectedOccasion,
          collisions: getOtherCourseCollisions(selectedOccasion),
          strategy: "button",
        },
        type,
      );
    },
    hasRecommendedMaster: occasions.some(
      (occasion) => occasion.recommendedMaster.length > 0,
    ),
  };
};
