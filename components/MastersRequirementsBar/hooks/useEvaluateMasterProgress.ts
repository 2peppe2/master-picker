import { useCallback, useMemo } from "react";
import { useAtomValue } from "jotai";
import _ from "lodash";

import { MasterRequirement } from "../types";
import semestersAtom from "@/app/atoms/semestersAtom";
import { COURSES } from "@/app/courses";

interface MasterProgress {
  progress: number;
  fulfilled: MasterRequirement[];
}

export const useEvaluateMasterProgress = () => {
  const semesters = useAtomValue(semestersAtom);

  const selectedCourses = useMemo(
    () =>
      semesters.flat(2).filter((course): course is string => course !== null),
    [semesters]
  );

  return useCallback(
    (master: string, requirements: MasterRequirement[]): MasterProgress => {
      const percentagePerReq = 100 / requirements.length;
      const fulfilled: MasterRequirement[] = [];
      let percentage = 0;

      for (const requirement of requirements) {
        if (requirement.type === "Courses") {
          const isFulfilled = selectedCourses.some((c) =>
            requirement.courses.includes(c)
          );

          if (isFulfilled) {
            fulfilled.push(requirement);
            percentage += percentagePerReq;
          }
        } else if (requirement.type === "Total") {
          const credits = calculateCredits(selectedCourses);
          const progress = _.clamp(credits / requirement.credits, 0, 1);
          percentage += percentagePerReq * progress;

          if (progress == 1) {
            fulfilled.push(requirement);
          }
        } else if (requirement.type === "A-level") {
          const credits = calculateCreditsByLevel({
            selectedCourses,
            master,
            level: "A",
          });
          const progress = _.clamp(credits / requirement.credits, 0, 1);
          percentage += percentagePerReq * progress;

          if (progress == 1) {
            fulfilled.push(requirement);
          }
        } else if (requirement.type === "G-level") {
          const credits = calculateCreditsByLevel({
            selectedCourses,
            master,
            level: "G",
          });
          const progress = _.clamp(credits / requirement.credits, 0, 1);
          percentage += percentagePerReq * progress;

          if (progress == 1) {
            fulfilled.push(requirement);
          }
        }
      }

      return {
        fulfilled,
        progress: Math.round(percentage),
      };
    },
    [selectedCourses]
  );
};

const calculateCredits = (selectedCourses: string[]): number =>
  selectedCourses
    .map((id) => COURSES[id].credits)
    .reduce((sum, c) => sum + c, 0);

const calculateCreditsByLevel = ({
  selectedCourses,
  master,
  level,
}: {
  selectedCourses: string[];
  master: string;
  level: "A" | "G";
}): number =>
  selectedCourses
    .map((id) => COURSES[id])
    .filter(
      (course) =>
        course.mastersPrograms.includes(master) && course.level.includes(level)
    )
    .reduce((sum, c) => sum + c.credits, 0);
