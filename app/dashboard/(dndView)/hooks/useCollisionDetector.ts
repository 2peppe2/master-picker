import { PeriodNodeData } from "@/components/Droppable";
import { CourseOccasion } from "../../page";
import { useScheduleGetters } from "@/app/atoms/schedule/hooks/useScheduleGetters";

interface DetectCollisionsArgs {
  occasion: CourseOccasion;
  overData: PeriodNodeData;
  targetPeriod: number;
  targetBlock: number;
}

export const useCollisionDetector = () => {
  const { getOccasionCollisions, getSlotCourse } = useScheduleGetters();

  const detectCollisions = ({
    occasion,
    overData,
    targetBlock,
    targetPeriod,
  }: DetectCollisionsArgs) => {
    const collisions = getOccasionCollisions({ occasion });
    const existingSlot = getSlotCourse({
      semester: overData.semesterNumber,
      period: targetPeriod,
      block: targetBlock,
    });

    return {
      collisions,
      existingSlot,
      hasConflict: !!existingSlot || collisions.length > 0,
    };
  };

  return { detectCollisions };
};
