import { scheduleAtoms } from "@/app/atoms/schedule/atoms";
import { Course, RequirementUnion } from "../../page";
import { useAtomValue } from "jotai";
import { useCallback } from "react";
import _ from "lodash";

interface MasterProgress {
  progress: number;
  fulfilled: RequirementUnion[];
}

export const useEvaluateMasterProgress = () => {
  const selectedMasterCourses = useAtomValue(
    scheduleAtoms.selectedMasterCoursesAtom,
  );
  const selectedCourses = useAtomValue(scheduleAtoms.selectedCoursesAtom);

  return useCallback(
    (requirements: RequirementUnion[]): MasterProgress => {
      if (requirements.length === 0) {
        return { progress: 0, fulfilled: [] };
      }

      const fulfilled: RequirementUnion[] = [];
      let totalProgress = 0;

      for (const requirement of requirements) {
        const progress = getProgressForRequirement(
          requirement,
          selectedCourses,
          selectedMasterCourses,
        );

        totalProgress += progress;

        if (progress >= 1) {
          fulfilled.push(requirement);
        }
      }

      return {
        fulfilled,
        progress: Math.floor((totalProgress / requirements.length) * 100),
      };
    },
    [selectedCourses, selectedMasterCourses],
  );
};

const getProgressForRequirement = (
  req: RequirementUnion,
  courses: Course[],
  masterCourses: Course[],
): number => {
  switch (req.type) {
    case "COURSE_SELECTION": {
      const selectedCodes = masterCourses.map((c) => c.code);

      const count = req.courses.filter((code) =>
        selectedCodes.includes(code.courseCode),
      ).length;

      return calculateMetricProgress(count, req.minCount);
    }
    case "CREDITS_ADVANCED_MASTER": {
      const current = calculateCreditsByLevel(masterCourses, "A");
      return calculateMetricProgress(current, req.credits);
    }
    case "CREDITS_ADVANCED_PROFILE": {
      const current = calculateProfileCredits(masterCourses, "A");
      return calculateMetricProgress(current, req.credits);
    }
    case "CREDITS_PROFILE_TOTAL": {
      const current = calculateProfileCredits(masterCourses);
      return calculateMetricProgress(current, req.credits);
    }
    case "CREDITS_MASTER_TOTAL": {
      const current = masterCourses.reduce(
        (sum, c) => sum + (c.credits || 0),
        0,
      );
      return calculateMetricProgress(current, req.credits);
    }
    case "CREDITS_TOTAL": {
      const current = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
      return calculateMetricProgress(current, req.credits);
    }
    default:
      return 0;
  }
};

const calculateMetricProgress = (current: number, required: number) => {
  if (required <= 0) return 1;
  return _.clamp(current / required, 0, 1);
};

const calculateProfileCredits = (courses: Course[], level?: "A" | "G") => {
  return courses
    .filter((c) => {
      const isProfileCourse = c.ecv === "E" || c.ecv === "V";
      const matchesLevel = level ? c.level.includes(level) : true;
      return isProfileCourse && matchesLevel;
    })
    .reduce((sum, c) => sum + (c.credits || 0), 0);
};

const calculateCreditsByLevel = (courses: Course[], level: "A" | "G") => {
  return courses
    .filter((c) => c.level.includes(level))
    .reduce((sum, c) => sum + (c.credits || 0), 0);
};
