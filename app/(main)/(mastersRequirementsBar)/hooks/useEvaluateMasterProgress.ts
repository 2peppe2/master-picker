import { useCallback } from "react";
import { useAtomValue } from "jotai";
import _ from "lodash";

import { selectedCoursesAtom } from "@/app/atoms/semestersAtom";
import { Course, RequirementsUnion } from "../../page";

interface MasterProgress {
  progress: number;
  fulfilled: RequirementsUnion[];
}

export const useEvaluateMasterProgress = () => {
  const selectedCourses = useAtomValue(selectedCoursesAtom);

  return useCallback(
    (requirements: RequirementsUnion[]): MasterProgress => {
      if (requirements.length === 0) {
        return { progress: 0, fulfilled: [] };
      }

      const percentagePerReq = 100 / requirements.length;
      const fulfilled: RequirementsUnion[] = [];
      let totalPercentage = 0;

      for (const requirement of requirements) {
        const progress = getProgressForRequirement(
          requirement,
          selectedCourses
        );

        totalPercentage += percentagePerReq * progress;

        if (progress === 1) {
          fulfilled.push(requirement);
        }
      }

      return {
        fulfilled,
        progress: Math.floor(totalPercentage),
      };
    },
    [selectedCourses]
  );
};

/**
 * Determines the progress (0.0 to 1.0) for a single requirement.
 */
const getProgressForRequirement = (
  req: RequirementsUnion,
  courses: Course[]
): number => {
  switch (req.type) {
    case "COURSES_OR": {
      const isFulfilled = courses.some((c) =>
        req.courses.map((c) => c.code).includes(c.code)
      );
      return isFulfilled ? 1 : 0;
    }
    case "TOTAL": {
      const current = calculateTotalCredits(courses);
      return calculateCreditProgress(current, req.credits);
    }
    case "A_LEVEL": {
      const current = calculateLevelCredits(courses, "A");
      return calculateCreditProgress(current, req.credits);
    }
    case "G_LEVEL": {
      const current = calculateLevelCredits(courses, "G");
      return calculateCreditProgress(current, req.credits);
    }
    default:
      return 0;
  }
};

const calculateCreditProgress = (current: number, required: number) => {
  if (required === 0) return 1;
  return _.clamp(current / required, 0, 1);
};

const calculateTotalCredits = (courses: Course[]): number =>
  courses.reduce((sum, c) => sum + c.credits, 0);

const calculateLevelCredits = (courses: Course[], level: "A" | "G"): number => {
  return courses
    .filter(
      (c) => !c.CourseMaster.some((master) => master.courseCode === c.code)
    )
    .filter((c) => c.level.includes(level))
    .reduce((sum, c) => sum + c.credits, 0);
};
