"use client";

import type { ConflictData } from "@/common/components/ConflictResolverModal";
import type { Course, CourseOccasion } from "@/common/types";
import { useOccasionCollisions } from "@/features/dashboard/state/schedule/hooks/useScheduleQueries";
import { useCallback, useState } from "react";
import type { StrategyType } from "./useCourseConflictResolver";

interface ShowConflictIfNeededArgs {
  course: Course;
  occasion: CourseOccasion;
  strategy: StrategyType;
}

export const useConflictManager = () => {
  const [conflictData, setConflictData] = useState<ConflictData | null>(null);
  const [conflictOpen, setConflictOpen] = useState(false);
  const getOccasionCollisions = useOccasionCollisions();

  const showConflict = useCallback((data: ConflictData) => {
    setConflictData(data);
    setConflictOpen(true);
  }, []);

  const showConflictIfNeeded = useCallback(
    ({ course, occasion, strategy }: ShowConflictIfNeededArgs) => {
      const collisions = getOccasionCollisions({ occasion });
      if (collisions.length === 0) return false;
      showConflict({ course, occasion, collisions, strategy });
      return true;
    },
    [getOccasionCollisions, showConflict],
  );

  return {
    conflictData,
    conflictOpen,
    showConflict,
    closeConflict: () => setConflictOpen(false),
    setConflictOpen,
    showConflictIfNeeded,
  };
};
