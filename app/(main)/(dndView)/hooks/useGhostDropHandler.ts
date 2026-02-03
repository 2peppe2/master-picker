import { useScheduleStore } from "@/app/atoms/schedule/scheduleStore";
import { PeriodNodeData } from "@/components/Droppable";
import { Course, CourseOccasion } from "../../page";

interface HandleGhostDropArgs {
  overData: PeriodNodeData;
  targetPeriod: number;
  course: Course;
  occasion: CourseOccasion;
}

export const useGhostDropHandler = () => {
  const { mutators, getters } = useScheduleStore();

  const handleGhostDrop = ({
    course,
    occasion,
    overData,
    targetPeriod,
  }: HandleGhostDropArgs) => {
    const currentBlocks = getters.getSlotBlocks({
      semester: overData.semesterNumber,
      period: targetPeriod,
    });

    const isGhostDrop = overData.blockNumber >= currentBlocks.length;

    if (isGhostDrop) {
      mutators.addBlockToSemester({ semester: overData.semesterNumber });
      mutators.addCourseByDrop({ course, occasion });
      return true;
    }

    return false;
  };

  return { handleGhostDrop };
};
