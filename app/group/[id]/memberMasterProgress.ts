import { RequirementUnion } from "@/app/dashboard/page";
import _ from "lodash";

export type MemberEvaluatedCourse = {
  code: string;
  credits: number | null;
  level: string;
  mainField: string[];
  CourseMaster: {
    master: string;
  }[];
};

interface MemberMasterProgress {
  progress: number;
  fulfilled: RequirementUnion[];
  allRequirementsWithProgress: RequirementUnion[];
}

interface GetProgressStatsArgs {
  master: string;
  requirement: RequirementUnion;
  courses: MemberEvaluatedCourse[];
  masterCourses: MemberEvaluatedCourse[];
}

interface RequirementStats {
  current: number;
  percent: number;
  fieldProgress?: Record<string, number>;
}

export const evaluateMemberMasterProgress = (
  master: string,
  requirements: RequirementUnion[],
  courses: MemberEvaluatedCourse[],
  masterCourses: MemberEvaluatedCourse[],
): MemberMasterProgress => {
  if (!requirements || requirements.length === 0) {
    return { progress: 0, fulfilled: [], allRequirementsWithProgress: [] };
  }

  let totalProgressPoints = 0;

  const allRequirementsWithProgress = requirements.map((req) => {
    const stats = getProgressStats({
      master,
      requirement: req,
      courses,
      masterCourses,
    });

    totalProgressPoints += stats.percent;
    return {
      ...req,
      current: stats.current,
      isFulfilled: stats.percent >= 1,
      fieldProgress: stats.fieldProgress,
    };
  });

  const fulfilled = allRequirementsWithProgress.filter((r) => r.isFulfilled);

  return {
    progress: Math.floor((totalProgressPoints / requirements.length) * 100),
    fulfilled,
    allRequirementsWithProgress,
  };
};

const getProgressStats = ({
  master,
  courses,
  masterCourses,
  requirement: req,
}: GetProgressStatsArgs): RequirementStats => {
  switch (req.type) {
    case "CREDITS_MAIN_FIELD_TOTAL": {
      const fieldProgress: Record<string, number> = {};

      req.fields.forEach((field) => {
        fieldProgress[field] = masterCourses
          .filter((c) => c.mainField?.includes(field))
          .reduce((sum, c) => sum + (c.credits || 0), 0);
      });

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
  courses: MemberEvaluatedCourse[],
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

const calculateCreditsByLevel = (
  courses: MemberEvaluatedCourse[],
  level: "A" | "G",
) => {
  return courses
    .filter((c) => c.level.includes(level))
    .reduce((sum, c) => sum + (c.credits || 0), 0);
};
