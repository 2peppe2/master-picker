"use client";

import { useScheduleMutators } from "@/app/dashboard/(store)/schedule/hooks/useScheduleMutators";
import { useScheduleGetters } from "@/app/dashboard/(store)/schedule/hooks/useScheduleGetters";
import { Course, CourseOccasion } from "@/app/dashboard/page";
import { PeriodNodeData } from "@/components/Droppable";

interface HandleGhostDropArgs {
  overData: PeriodNodeData;
  targetPeriod: number;
  course: Course;
  occasion: CourseOccasion;
}

export const useGhostDropHandler = () => {
  const { addBlockToSemester, addCourseByDrop, removeCourse } =
    useScheduleMutators();
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
      removeCourse({ courseCode: course.code });
      addCourseByDrop({ course, occasion });
      return true;
    }

    return false;
  };

  return { handleGhostDrop };
};
