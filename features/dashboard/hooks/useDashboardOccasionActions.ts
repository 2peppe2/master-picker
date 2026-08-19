"use client";

import type { OccasionActions } from "@/common/components/CourseDialog/types";
import { useOccasionCollisions } from "@/features/dashboard/state/schedule/hooks/useScheduleQueries";
import { useCourseConflictResolver } from "./useCourseConflictResolver";

export const useDashboardOccasionActions = (): OccasionActions => {
  const getOccasionCollisions = useOccasionCollisions();
  const { executeAdd, resolveConflict } = useCourseConflictResolver();

  return {
    getCollisions: (occasion) => getOccasionCollisions({ occasion }),
    onAdd: (course, occasion) =>
      executeAdd({ course, occasion, strategy: "button" }),
    onResolve: (data, type) => resolveConflict({ ...data, type }),
  };
};
