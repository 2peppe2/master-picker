import { PeriodNodeData } from "@/components/Droppable";
import { Course, CourseOccasion } from "../../page";
import { useScheduleGetters } from "@/app/atoms/schedule/hooks/useScheduleGetters";
import { useScheduleMutators } from "@/app/atoms/schedule/hooks/useScheduleMutators";

interface HandleGhostDropArgs {
  overData: PeriodNodeData;
  targetPeriod: number;
  course: Course;
  occasion: CourseOccasion;
}

export const useGhostDropHandler = () => {
  const { addBlockToSemester, addCourseByDrop } = useScheduleMutators();
  const { getSlotBlocks } = useScheduleGetters();

  const handleGhostDrop = ({
    course,
    occasion,
    overData,
    targetPeriod,
  }: HandleGhostDropArgs) => {
    const currentBlocks = getSlotBlocks({
      semester: overData.semesterNumber,
      period: targetPeriod,
    });

    const isGhostDrop = overData.blockNumber >= currentBlocks.length;

    if (isGhostDrop) {
      addBlockToSemester({ semester: overData.semesterNumber });
      addCourseByDrop({ course, occasion });
      return true;
    }

    return false;
  };

  return { handleGhostDrop };
};
