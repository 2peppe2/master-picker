"use client";

import { useScheduleGetters } from "@/app/atoms/schedule/hooks/useScheduleGetters";
import { PeriodNodeData } from "@/components/Droppable";
import { Course, CourseOccasion } from "../../page";

interface DetectCollisionsArgs {
  course?: Course;
  occasion: CourseOccasion;
  overData: PeriodNodeData;
  targetPeriod: number;
  targetBlock: number;
}

export const useCollisionDetector = () => {
  const { getOccasionCollisions, getSlotCourse } = useScheduleGetters();

  const detectCollisions = ({
    course,
    occasion,
    overData,
    targetBlock,
    targetPeriod,
  }: DetectCollisionsArgs) => {
    let collisions = getOccasionCollisions({ occasion });
    if (course) {
      collisions = collisions.filter((c) => c.code !== course.code);
    }
    
    const existingSlot = getSlotCourse({
      semester: overData.semesterNumber,
      period: targetPeriod,
      block: targetBlock,
    });

    const actualExistingSlot = existingSlot?.code === course?.code ? null : existingSlot;

    return {
      collisions,
      existingSlot: actualExistingSlot,
      hasConflict: !!actualExistingSlot || collisions.length > 0,
    };
  };

  return { detectCollisions };
};
