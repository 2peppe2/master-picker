import { useScheduleStore } from "@/app/atoms/schedule/scheduleStore";
import { PeriodNodeData } from "@/components/Droppable";
import { CourseOccasion } from "../../page";

interface DetectCollisionsArgs {
  occasion: CourseOccasion;
  overData: PeriodNodeData;
  targetPeriod: number;
  targetBlock: number;
}

export const useCollisionDetector = () => {
  const { getters } = useScheduleStore();

  const detectCollisions = ({
    occasion,
    overData,
    targetBlock,
    targetPeriod,
  }: DetectCollisionsArgs) => {
    const collisions = getters.getOccasionCollisions({ occasion });
    const existingSlot = getters.getSlotCourse({
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
