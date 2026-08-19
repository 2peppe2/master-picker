"use client";

import { dispatchScrollToCourse } from "@/common/hooks/useCourseAddedFeedback";
import { useToRelativeSemester } from "@/common/hooks/useToRelativeSemester";
import type { Course, CourseOccasion } from "@/common/types";
import {
  useBlockCommands,
  useCourseCommands,
} from "@/features/dashboard/state/schedule/hooks/useScheduleCommands";
import { useWildcardExpansion } from "@/features/dashboard/state/schedule/hooks/useScheduleQueries";

export type ConflictType = "replace" | "extra";
export type StrategyType = "dropped" | "button";

export interface ExecuteAddArgs {
  course: Course;
  occasion: CourseOccasion;
  strategy: StrategyType;
}

export interface ResolveConflictArgs extends ExecuteAddArgs {
  type: ConflictType;
  collisions: Course[];
}

export const useCourseConflictResolver = () => {
  const toRelativeSemester = useToRelativeSemester();
  const checkWildcardExpansion = useWildcardExpansion();
  const { addCourse, removeCourse } = useCourseCommands();
  const { addBlockToSemester } = useBlockCommands();

  const executeAdd = ({ course, occasion, strategy }: ExecuteAddArgs) => {
    if (strategy === "dropped") {
      addCourse({ course, occasion });
      return;
    }

    if (checkWildcardExpansion({ occasion })) {
      addBlockToSemester(
        toRelativeSemester({ year: occasion.year, semester: occasion.semester }),
      );
    }
    addCourse({ course, occasion });
    dispatchScrollToCourse({ course, occasion });
  };

  const resolveConflict = ({
    collisions,
    course,
    occasion,
    strategy,
    type,
  }: ResolveConflictArgs) => {
    if (strategy === "dropped") removeCourse({ courseCode: course.code });

    if (type === "replace") {
      collisions.forEach((collision) =>
        removeCourse({ courseCode: collision.code }),
      );
      executeAdd({ course, occasion, strategy });
      return;
    }

    addBlockToSemester(
      toRelativeSemester({ year: occasion.year, semester: occasion.semester }),
    );
    executeAdd({
      course,
      strategy,
      occasion: {
        ...occasion,
        periods: occasion.periods.map((period) => ({ ...period, blocks: [] })),
      },
    });
  };

  return { executeAdd, resolveConflict };
};
