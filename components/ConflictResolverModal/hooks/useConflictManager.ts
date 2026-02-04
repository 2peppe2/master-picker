import { useScheduleGetters } from "@/app/atoms/schedule/hooks/useScheduleGetters";
import { ConflictData } from "@/components/ConflictResolverModal";
import { Course, CourseOccasion } from "@/app/dashboard/page";
import { StrategyType } from "./useCourseContlictResolver";
import { useCallback, useState } from "react";

interface ShowConflictIfNeededArgs {
  course: Course;
  occasion: CourseOccasion;
  strategy: StrategyType;
}

export const useConflictManager = () => {
  const [conflictData, setConflictData] = useState<ConflictData | null>(null);
  const [conflictOpen, setConflictOpen] = useState(false);
  const { getOccasionCollisions } = useScheduleGetters();

  /**
   * Shows the conflict resolution dialog with the provided data.
   */
  const showConflict = useCallback((data: ConflictData) => {
    setConflictData(data);
    setConflictOpen(true);
  }, []);

  const closeConflict = () => {
    setConflictOpen(false);
  };

  /**
   * Shows conflict dialog by checking collisions for the given occasion.
   * Only shows if collisions exist.
   * Returns true if conflicts were found, false otherwise.
   */
  const showConflictIfNeeded = useCallback(
    ({ course, occasion, strategy }: ShowConflictIfNeededArgs) => {
      const collisions = getOccasionCollisions({ occasion });
      if (collisions.length > 0) {
        showConflict({ course, occasion, collisions, strategy });
        return true;
      }
      return false;
    },
    [getOccasionCollisions, showConflict],
  );

  return {
    conflictData,
    conflictOpen,
    showConflict,
    closeConflict,
    setConflictOpen,
    showConflictIfNeeded,
  };
};
