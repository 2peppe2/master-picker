"use client";

import {
  useBlockCommands,
  useCourseCommands,
} from "@/features/dashboard/state/schedule/hooks/useScheduleCommands";
import { useSlotBlocks } from "@/features/dashboard/state/schedule/hooks/useScheduleQueries";
import { Course, CourseOccasion } from "@/common/types";
import { PeriodNodeData } from "@/features/dashboard/components/Droppable";

interface HandleGhostDropArgs {
  overData: PeriodNodeData;
  targetPeriod: number;
  course: Course;
  occasion: CourseOccasion;
}

export const useGhostDropHandler = () => {
  const { addCourse, removeCourse } = useCourseCommands();
  const { addBlockToSemester } = useBlockCommands();
  const getSlotBlocks = useSlotBlocks();

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
      addBlockToSemester(overData.semesterNumber);
      removeCourse({ courseCode: course.code });
      addCourse({ course, occasion });
      return true;
    }

    return false;
  };

  return { handleGhostDrop };
};
