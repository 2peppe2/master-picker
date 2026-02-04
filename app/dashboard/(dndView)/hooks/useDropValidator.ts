import { relativeSemesterToYearAndSemester } from "@/lib/semesterYearTranslations";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { WILDCARD_BLOCK_START } from "@/app/atoms/schedule/atoms";
import { PeriodNodeData } from "@/components/Droppable";
import { Course } from "../../page";
import { useAtomValue } from "jotai";

interface ValidateDropArgs {
  course: Course;
  overData: PeriodNodeData;
}

export const useDropValidator = () => {
  const { startingYear } = useAtomValue(userPreferencesAtom);

  const validateDrop = ({ course, overData }: ValidateDropArgs) => {
    const { year, semester } = relativeSemesterToYearAndSemester(
      startingYear,
      overData.semesterNumber,
    );

    const occasion = course.CourseOccasion.find(
      (occ) => occ.year === year && occ.semester === semester,
    );

    if (!occasion) return null;

    const targetPeriod = overData.periodNumber + 1;
    const period = occasion.periods.find((p) => p.period === targetPeriod);

    if (!period) return null;

    const targetBlock = overData.blockNumber + 1;
    const isWildcardDrop = targetBlock > WILDCARD_BLOCK_START;
    const isValidDrop = isWildcardDrop || period.blocks.includes(targetBlock);

    if (!isValidDrop) return null;

    return {
      occasion,
      period,
      targetPeriod,
      targetBlock,
      isWildcardDrop,
    };
  };

  return { validateDrop };
};
