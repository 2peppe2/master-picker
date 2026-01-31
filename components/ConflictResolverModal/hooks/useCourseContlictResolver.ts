import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { useScheduleStore } from "@/app/atoms/schedule/scheduleStore";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { Course, CourseOccasion } from "@/app/(main)/page";
import { useAtomValue } from "jotai";

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
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const {
    mutators: {
      addCourseByButton,
      addCourseByDrop,
      addBlockToSemester,
      removeCourse,
    },
    getters: { checkWildcardExpansion },
  } = useScheduleStore();

  const executeAdd = ({ course, occasion, strategy }: ExecuteAddArgs) => {
    if (strategy === "dropped") {
      addCourseByDrop({
        course,
        occasion,
      });
    } else {
      if (checkWildcardExpansion({ occasion })) {
        const relativeSemester = yearAndSemesterToRelativeSemester(
          startingYear,
          occasion.year,
          occasion.semester,
        );
        addBlockToSemester({ semester: relativeSemester });
      }
      addCourseByButton({ course, occasion });
    }
  };

  const resolveConflict = ({
    collisions,
    course,
    occasion,
    strategy,
    type,
  }: ResolveConflictArgs) => {
    if (type === "replace") {
      collisions.forEach((c) => removeCourse({ courseCode: c.code }));
      executeAdd({ course, occasion, strategy });
    } else {
      const relativeSemester = yearAndSemesterToRelativeSemester(
        startingYear,
        occasion.year,
        occasion.semester,
      );

      addBlockToSemester({ semester: relativeSemester });

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
