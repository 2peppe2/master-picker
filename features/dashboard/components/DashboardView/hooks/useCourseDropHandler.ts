"use client";

import { useCourseContlictResolver } from "@/common/components/ConflictResolverModal/hooks/useCourseContlictResolver";
import { useConflictManager } from "@/common/components/ConflictResolverModal/hooks/useConflictManager";
import { useCourseCommands } from "@/features/dashboard/state/schedule/hooks/useScheduleCommands";
import { useCollisionDetector } from "./useCollisionDetector";
import { useGhostDropHandler } from "./useGhostDropHandler";
import { PeriodNodeData } from "@/features/dashboard/components/Droppable";
import { useDropValidator } from "./useDropValidator";
import { Course } from "@/common/types";

interface HandleDropArgs {
  course: Course;
  overData: PeriodNodeData;
}

/** Coordinates validated course placement and any resulting conflict flow. */
export const useCourseDropHandler = () => {
  const { showConflict, conflictData, conflictOpen, setConflictOpen } =
    useConflictManager();
  const { detectCollisions } = useCollisionDetector();
  const { executeAdd } = useCourseContlictResolver();
  const { handleGhostDrop } = useGhostDropHandler();
  const { removeCourse } = useCourseCommands();
  const { validateDrop } = useDropValidator();

  const handleDrop = ({ course, overData }: HandleDropArgs): boolean => {
    const validatonResult = validateDrop({
      course,
      overData,
    });
    if (!validatonResult) return false;

    const {
      occasion: validOccasion,
      targetPeriod,
      targetBlock,
      isWildcardDrop,
    } = validatonResult;

    const occasion = isWildcardDrop
      ? {
          ...validOccasion,
          periods: validOccasion.periods.map((p) => ({ ...p, blocks: [] })),
        }
      : validOccasion;

    const wasGhostDrop = handleGhostDrop({
      overData,
      targetPeriod,
      course,
      occasion,
    });
    if (wasGhostDrop) return true;

    const { collisions, hasConflict } = detectCollisions({
      course,
      overData,
      targetPeriod,
      targetBlock,
      occasion,
    });

    if (hasConflict) {
      showConflict({
        course,
        occasion,
        collisions,
        strategy: "dropped",
      });
    } else {
      removeCourse({ courseCode: course.code });
      executeAdd({
        course,
        occasion,
        strategy: "dropped",
      });
    }

    return true;
  };

  return { handleDrop, conflictData, conflictOpen, setConflictOpen };
};

export type UseCourseDropHandler = ReturnType<typeof useCourseDropHandler>;
