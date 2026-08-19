"use client";

import { useOccasionCollisions } from "@/features/dashboard/state/schedule/hooks/useScheduleQueries";
import { useCourseContlictResolver } from "@/common/components/ConflictResolverModal/hooks/useCourseContlictResolver";
import { useToRelativeSemester } from "@/common/hooks/useToRelativeSemester";
import { sortCourseOccasionsByPreferredSemesters } from "@/common/courseOccasionOrdering";
import { Course, CourseOccasion } from "@/common/types";
import { useMemo, useState } from "react";

interface UseOccasionTableStateArgs {
  course: Course;
  preferredSemesters?: number[];
}

export const useOccasionTableState = ({
  course,
  preferredSemesters,
}: UseOccasionTableStateArgs) => {
  const [selectedOccasion, setSelectedOccasion] =
    useState<CourseOccasion | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const getOccasionCollisions = useOccasionCollisions();
  const { executeAdd } = useCourseContlictResolver();
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
    getOccasionCollisions({ occasion }).filter(
      (collision) => collision.code !== course.code,
    );

  const handleAdd = (occasion: CourseOccasion) => {
    if (getOtherCourseCollisions(occasion).length > 0) {
      setSelectedOccasion(occasion);
      setAlertOpen(true);
      return;
    }

    executeAdd({ course, occasion, strategy: "button" });
  };

  return {
    alertOpen,
    occasions,
    selectedOccasion,
    setAlertOpen,
    setSelectedOccasion,
    getOtherCourseCollisions,
    handleAdd,
    hasRecommendedMaster: occasions.some(
      (occasion) => occasion.recommendedMaster.length > 0,
    ),
  };
};
