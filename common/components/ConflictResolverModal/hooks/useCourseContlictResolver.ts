"use client";

import { useBlockCommands, useCourseCommands } from "@/features/dashboard/state/schedule/hooks/useScheduleCommands";
import { useWildcardExpansion } from "@/features/dashboard/state/schedule/hooks/useScheduleQueries";
import { dispatchScrollToCourse } from "@/common/hooks/useCourseAddedFeedback";
import { useToRelativeSemester } from "@/common/hooks/useToRelativeSemester";
import { Course, CourseOccasion } from "@/common/types";

export interface DropSlot {
  block: number;
  period: number;
}

export type ConflictType = "replace" | "extra";

export type StrategyType = "dropped" | "button";

export interface ExecuteAddArgs {
  course: Course;
  occasion: CourseOccasion;
  strategy: StrategyType;
}

export interface ResolveConflictArgs {
  type: ConflictType;
  course: Course;
  occasion: CourseOccasion;
  collisions: Course[];
  strategy: StrategyType;
}

export const useCourseContlictResolver = () => {
  const yearAndSemesterToRelativeSemester = useToRelativeSemester();
  const checkWildcardExpansion = useWildcardExpansion();
  const { addCourse, removeCourse } = useCourseCommands();
  const { addBlockToSemester } = useBlockCommands();

  const executeAdd = ({ course, occasion, strategy }: ExecuteAddArgs) => {
    if (strategy === "dropped") {
      addCourse({
        course,
        occasion,
      });
    } else {
      if (checkWildcardExpansion({ occasion })) {
        const relativeSemester = yearAndSemesterToRelativeSemester({
          year: occasion.year,
          semester: occasion.semester,
        });
        addBlockToSemester(relativeSemester);
      }
      addCourse({ course, occasion });
      dispatchScrollToCourse({ course, occasion });
    }
  };

  const resolveConflict = ({
    collisions,
    course,
    occasion,
    strategy,
    type,
  }: ResolveConflictArgs) => {
    if (strategy === "dropped") {
      removeCourse({ courseCode: course.code });
    }

    if (type === "replace") {
      collisions.forEach((c) => removeCourse({ courseCode: c.code }));
      executeAdd({ course, occasion, strategy });
    } else {
      const relativeSemester = yearAndSemesterToRelativeSemester({
        year: occasion.year,
        semester: occasion.semester,
      });

      addBlockToSemester(relativeSemester);

      const wildcardOccasion = {
        ...occasion,
        periods: occasion.periods.map((p) => ({ ...p, blocks: [] })),
      };

      executeAdd({ course, occasion: wildcardOccasion, strategy });
    }
  };

  return {
    executeAdd,
    resolveConflict,
  };
};
