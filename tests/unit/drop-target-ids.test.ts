import { describe, expect, it } from "vitest";
import {
  getDragTargetFeedback,
  getValidDropTargetIds,
  newWildcardDropTargetId,
  standardDropTargetId,
  wildcardDropTargetId,
} from "@/features/dashboard/state/drag/domain";
import type { ScheduleGrid } from "@/features/dashboard/state/schedule/types";
import type { Course } from "@/common/types";

const grid: ScheduleGrid = [
  [
    [null, null, null, null, null],
    [null, null, null, null],
  ],
];

const course = {
  code: "TST100",
  CourseOccasion: [
    {
      year: 2025,
      semester: "HT",
      periods: [
        { period: 1, blocks: [1, 3] },
        { period: 2, blocks: [] },
      ],
    },
  ],
} as unknown as Course;

describe("getValidDropTargetIds", () => {
  it("resolves standard, existing wildcard, and new wildcard targets at drag start", () => {
    const targetIds = getValidDropTargetIds({
      course,
      grid,
      startingYear: 2025,
    });

    expect(targetIds).toEqual(
      new Set([
        standardDropTargetId(0, 0, 0),
        standardDropTargetId(0, 0, 2),
        wildcardDropTargetId(0, 0, 4),
        newWildcardDropTargetId(0, 1, 4),
      ]),
    );
  });

  it("returns per-term target counts for drag navigation without recalculating compatibility", () => {
    const feedback = getDragTargetFeedback({
      course,
      grid,
      startingYear: 2025,
    });

    expect(feedback.compatibleSemesters).toEqual([
      { semesterNumber: 0, targetCount: 4 },
    ]);
    expect(feedback.validTargetIds).toEqual(
      getValidDropTargetIds({ course, grid, startingYear: 2025 }),
    );
  });
});
