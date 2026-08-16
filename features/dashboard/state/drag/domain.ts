import { WILDCARD_BLOCK_START } from "../schedule/constants";
import type { ScheduleGrid } from "../schedule/types";
import type { Course } from "@/common/types";
import { relativeSemesterToYearAndSemester } from "@/lib/semesterYearTranslations";

export interface CompatibleSemester {
  semesterNumber: number;
  targetCount: number;
}

export interface DragTargetFeedback {
  validTargetIds: ReadonlySet<string>;
  compatibleSemesters: CompatibleSemester[];
}

export const standardDropTargetId = (
  semester: number,
  period: number,
  block: number,
) => `block-${semester}-${period}-${block}`;
export const wildcardDropTargetId = (
  semester: number,
  period: number,
  block: number,
) => `ghost-${semester}-${period}-${block}`;
export const newWildcardDropTargetId = (
  semester: number,
  period: number,
  block: number,
) => `ghost-semester-${semester}-period${period}-block-${block}`;

export const getDragTargetFeedback = ({
  course,
  grid,
  startingYear,
}: {
  course: Course;
  grid: ScheduleGrid;
  startingYear: number;
}): DragTargetFeedback => {
  const validTargetIds = new Set<string>();
  const targetCounts = new Map<number, number>();
  const addTarget = (semester: number, id: string) => {
    validTargetIds.add(id);
    targetCounts.set(semester, (targetCounts.get(semester) ?? 0) + 1);
  };

  grid.forEach((periods, semesterNumber) => {
    const { year, semester } = relativeSemesterToYearAndSemester(
      startingYear,
      semesterNumber,
    );
    const occasions = course.CourseOccasion.filter(
      (occasion) => occasion.year === year && occasion.semester === semester,
    );
    if (!occasions.length) return;
    periods.forEach((blocks, periodNumber) => {
      const matchingPeriods = occasions
        .map((occasion) =>
          occasion.periods.find((period) => period.period === periodNumber + 1),
        )
        .filter(
          (period): period is (typeof occasions)[number]["periods"][number] =>
            Boolean(period),
        );
      if (!matchingPeriods.length) return;
      blocks.forEach((_, blockNumber) => {
        if (blockNumber >= WILDCARD_BLOCK_START) {
          addTarget(
            semesterNumber,
            wildcardDropTargetId(semesterNumber, periodNumber, blockNumber),
          );
        } else if (
          matchingPeriods.some((period) =>
            period.blocks.includes(blockNumber + 1),
          )
        ) {
          addTarget(
            semesterNumber,
            standardDropTargetId(semesterNumber, periodNumber, blockNumber),
          );
        }
      });
      if (blocks.length === WILDCARD_BLOCK_START) {
        addTarget(
          semesterNumber,
          newWildcardDropTargetId(semesterNumber, periodNumber, blocks.length),
        );
      }
    });
  });
  return {
    validTargetIds,
    compatibleSemesters: [...targetCounts.entries()].map(
      ([semesterNumber, targetCount]) => ({ semesterNumber, targetCount }),
    ),
  };
};

export const getValidDropTargetIds = (
  args: Parameters<typeof getDragTargetFeedback>[0],
) => getDragTargetFeedback(args).validTargetIds;
