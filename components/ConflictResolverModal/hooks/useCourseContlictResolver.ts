import { useScheduleMutators } from "@/app/atoms/schedule/hooks/useScheduleMutators";
import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { useScheduleGetters } from "@/app/atoms/schedule/hooks/useScheduleGetters";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { Course, CourseOccasion } from "@/app/dashboard/page";
import { useAtomValue } from "jotai";
import { dispatchScrollToCourse } from "@/hooks/useCourseAddedFeedback";

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
  const { checkWildcardExpansion } = useScheduleGetters();
  const {
    addCourseByButton,
    addCourseByDrop,
    addBlockToSemester,
    removeCourse,
  } = useScheduleMutators();

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
