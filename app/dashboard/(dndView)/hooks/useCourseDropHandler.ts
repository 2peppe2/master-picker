import { useCourseContlictResolver } from "@/components/ConflictResolverModal/hooks/useCourseContlictResolver";
import { useConflictManager } from "../../../../components/ConflictResolverModal/hooks/useConflictManager";
import { useScheduleMutators } from "@/app/atoms/schedule/hooks/useScheduleMutators";
import { useCollisionDetector } from "./useCollisionDetector";
import { useGhostDropHandler } from "./useGhostDropHandler";
import { PeriodNodeData } from "@/components/Droppable";
import { useDropValidator } from "./useDropValidator";
import { Course } from "../../page";

interface HandleDropArgs {
  course: Course;
  overData: PeriodNodeData;
}

export const useCourseDropHandler = () => {
  const { showConflict, conflictData, conflictOpen, setConflictOpen } =
    useConflictManager();
  const { detectCollisions } = useCollisionDetector();
  const { executeAdd } = useCourseContlictResolver();
  const { handleGhostDrop } = useGhostDropHandler();
  const { validateDrop } = useDropValidator();
  const { removeCourse } = useScheduleMutators();

  const handleDrop = ({ course, overData }: HandleDropArgs): boolean => {
    const validatonResult = validateDrop({
      course,
      overData,
    });
    if (!validatonResult) return false;

    // Make sure the course have no other occurence
    // when being dropped to a new place.
    removeCourse({
      courseCode: course.code,
    });

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
