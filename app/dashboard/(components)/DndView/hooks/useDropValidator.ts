"use client";

import { useStartingYear } from "@/app/dashboard/(store)/preferences/hooks/useStartingYear";
import { relativeSemesterToYearAndSemester } from "@/lib/semesterYearTranslations";
import { WILDCARD_BLOCK_START } from "@/app/dashboard/(store)/schedule/atoms";
import { PeriodNodeData } from "@/components/Droppable";
import { Course } from "../../../page";

interface ValidateDropArgs {
  course: Course;
  overData: PeriodNodeData;
}

export const useDropValidator = () => {
  const startingYear = useStartingYear();

  const validateDrop = ({ course, overData }: ValidateDropArgs) => {
    const { year, semester } = relativeSemesterToYearAndSemester(
      startingYear,
      overData.semesterNumber,
    );

    const matchingOccasions = course.CourseOccasion.filter(
      (occ) => occ.year === year && occ.semester === semester,
    );

    if (matchingOccasions.length === 0) return null;

    const targetPeriod = overData.periodNumber + 1;
    const targetBlock = overData.blockNumber + 1;
    const isWildcardDrop = targetBlock > WILDCARD_BLOCK_START;

    for (const occasion of matchingOccasions) {
      const period = occasion.periods.find((p) => p.period === targetPeriod);

      if (period) {
        const isValidBlock =
          isWildcardDrop || period.blocks.includes(targetBlock);

        if (isValidBlock) {
          return {
            occasion,
            period,
            targetPeriod,
            targetBlock,
            isWildcardDrop,
          };
        }
      }
    }

    return null;
  };

  return { validateDrop };
};
