import { beforeEach, describe, expect, it, vi } from "vitest";
import { Semester } from "@/prisma/generated/client/enums";

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));

vi.mock("@/lib/prisma", () => ({
  prisma: { course: { findMany } },
}));

import { getBachelorCourses } from "@/app/actions/getBachelorCourses";

describe("getBachelorCourses", () => {
  beforeEach(() => {
    findMany.mockReset();
    findMany.mockResolvedValue([]);
  });

  it("only includes occasions from the selected six-semester window", async () => {
    findMany.mockResolvedValueOnce([
      {
        CourseOccasion: [
          { year: 2023, semester: Semester.HT },
          { year: 2023, semester: Semester.VT },
        ],
      },
    ]);

    const courses = await getBachelorCourses("6CMJU", 2022);

    const query = findMany.mock.calls[0][0];
    const expectedOccasionFilter = {
      OR: [
        { year: 2022, semester: Semester.HT },
        { year: 2023, semester: Semester.VT },
        { year: 2023, semester: Semester.HT },
        { year: 2024, semester: Semester.VT },
        { year: 2024, semester: Semester.HT },
        { year: 2025, semester: Semester.VT },
      ],
    };

    expect(query.where.CourseOccasion.some).toEqual(expectedOccasionFilter);
    expect(query.include.CourseOccasion.where).toEqual(
      expectedOccasionFilter,
    );
    expect(query.include.CourseOccasion.orderBy).toEqual([
      { year: "asc" },
      { semester: "asc" },
    ]);
    expect(courses[0].CourseOccasion).toEqual([
      { year: 2023, semester: Semester.VT },
      { year: 2023, semester: Semester.HT },
    ]);
  });
});
