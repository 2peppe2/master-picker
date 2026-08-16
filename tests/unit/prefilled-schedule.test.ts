import { describe, expect, it } from "vitest";
import { generatePrefilledSchedule } from "@/features/dashboard/state/schedule/hooks/useGeneratePrefilledSchedule";
import type { Course } from "@/common/types";

const courseWithOccasion = (
  code: string,
  year: number,
  semester: "HT" | "VT",
) =>
  ({
    code,
    CourseOccasion: [
      {
        id: code,
        year,
        semester,
        periods: [{ period: 1, blocks: [1] }],
      },
    ],
  }) as unknown as Course;

describe("generatePrefilledSchedule", () => {
  it("skips historical occasions and places valid occasions from the selected year", () => {
    const historicalCourse = courseWithOccasion("HIST", 2021, "HT");
    const startingYearCourse = courseWithOccasion("CURRENT", 2022, "HT");

    const schedule = generatePrefilledSchedule({
      courses: [historicalCourse, startingYearCourse],
      startingYear: 2022,
    });

    expect(schedule[0][0][0]).toMatchObject({ code: "CURRENT" });
    expect(schedule.flat(2)).not.toContain(historicalCourse);
  });
});
