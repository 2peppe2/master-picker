"use client";

import { scheduleAtoms } from "@/app/dashboard/(store)/schedule/atoms";
import { Course, RequirementUnion } from "../../../page";
import { useAtomValue } from "jotai";
import { useCallback } from "react";
import _ from "lodash";

interface MasterProgress {
  progress: number;
  fulfilled: RequirementUnion[];
  allRequirementsWithProgress: RequirementUnion[];
}

export const useEvaluateMasterProgress = () => {
  const selectedMasterCourses = useAtomValue(
    scheduleAtoms.selectedMasterCoursesAtom,
  );
  const selectedCourses = useAtomValue(scheduleAtoms.selectedCoursesAtom);

  return useCallback(
    (master: string, requirements: RequirementUnion[]): MasterProgress => {
      if (!requirements || requirements.length === 0) {
        return { progress: 0, fulfilled: [], allRequirementsWithProgress: [] };
      }

      let totalProgressPoints = 0;

      const allRequirementsWithProgress = requirements.map((req) => {
        const stats = getProgressStats({
          master,
          requirement: req,
          courses: selectedCourses,
          masterCourses: selectedMasterCourses,
        });

        totalProgressPoints += stats.percent;

        return {
          ...req,
          current: stats.current,
          isFulfilled: stats.percent >= 1,
          fieldProgress: stats.fieldProgress,
        };
      });

      const fulfilled = allRequirementsWithProgress.filter(
        (r) => r.isFulfilled,
      );

      const overallProgress = Math.floor(
        (totalProgressPoints / requirements.length) * 100,
      );

      return {
        progress: overallProgress,
        fulfilled,
        allRequirementsWithProgress,
      };
    },
    [selectedCourses, selectedMasterCourses],
  );
};

interface GetProgressStatsArgs {
  master: string;
  requirement: RequirementUnion;
  courses: Course[];
  masterCourses: Course[];
}

interface RequirementStats {
  current: number;
  percent: number;
  fieldProgress?: Record<string, number>;
}

const getProgressStats = ({
  master,
  courses,
  masterCourses,
  requirement: req,
}: GetProgressStatsArgs): RequirementStats => {
  switch (req.type) {
    case "CREDITS_MAIN_FIELD_TOTAL": {
      const fieldProgress: Record<string, number> = {};

      // Calculate individual HP for each field in the list
      req.fields.forEach((field) => {
        fieldProgress[field] = masterCourses
          .filter((c) => c.mainField?.includes(field))
          .reduce((sum, c) => sum + (c.credits || 0), 0);
      });

      // Overall requirement progress is the sum of all valid main field credits
      const totalInMainFields = masterCourses
        .filter((c) => c.mainField?.some((f) => req.fields.includes(f)))
        .reduce((sum, c) => sum + (c.credits || 0), 0);

      return {
        current: totalInMainFields,
        percent: calculateMetricProgress(totalInMainFields, req.credits),
        fieldProgress,
      };
    }

    case "COURSE_SELECTION": {
      const selectedCodes = masterCourses.map((c) => c.code);
      const count = req.courses.filter((code) =>
        selectedCodes.includes(code.courseCode),
      ).length;

      return {
        current: count,
        percent: calculateMetricProgress(count, req.minCount),
      };
    }

    case "CREDITS_ADVANCED_MASTER": {
      const current = calculateCreditsByLevel(masterCourses, "A");
      return {
        current,
        percent: calculateMetricProgress(current, req.credits),
      };
    }

    case "CREDITS_ADVANCED_PROFILE": {
      const current = calculateProfileCredits(masterCourses, master, "A");
      return {
        current,
        percent: calculateMetricProgress(current, req.credits),
      };
    }

    case "CREDITS_PROFILE_TOTAL": {
      const current = calculateProfileCredits(masterCourses, master);
      return {
        current,
        percent: calculateMetricProgress(current, req.credits),
      };
    }

    case "CREDITS_MASTER_TOTAL": {
      const current = masterCourses.reduce(
        (sum, c) => sum + (c.credits || 0),
        0,
      );
      return {
        current,
        percent: calculateMetricProgress(current, req.credits),
      };
    }

    case "CREDITS_TOTAL": {
      const current = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
      return {
        current,
        percent: calculateMetricProgress(current, req.credits),
      };
    }

    default:
      return { current: 0, percent: 0 };
  }
};

const calculateMetricProgress = (current: number, required: number) => {
  if (required <= 0) return 1;
  return _.clamp(current / required, 0, 1);
};

const calculateProfileCredits = (
  courses: Course[],
  master: string,
  level?: "A" | "G",
) => {
  return courses
    .filter((c) => {
      const isProfileCourse = c.CourseMaster.some((m) => m.master === master);
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
