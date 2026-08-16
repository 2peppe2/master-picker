import { describe, expect, it } from "vitest";
import {
  OccasionSemester,
  sortCourseOccasionsByPreferredSemesters,
} from "@/common/courseOccasionOrdering";

const occasions = [
  { id: "semester-7", year: 2025, semester: "HT" as const },
  { id: "semester-9", year: 2026, semester: "HT" as const },
  { id: "semester-8", year: 2026, semester: "VT" as const },
];

const toRelativeSemester = ({ year, semester }: OccasionSemester) =>
  (year - 2022) * 2 + (semester === "HT" ? 0 : -1);

describe("sortCourseOccasionsByPreferredSemesters", () => {
  it("uses the active semester selection order before unselected occasions", () => {
    expect(
      sortCourseOccasionsByPreferredSemesters({
        occasions,
        preferredSemesters: [9, 7],
        toRelativeSemester,
      }).map((occasion) => occasion.id),
    ).toEqual(["semester-9", "semester-7", "semester-8"]);
  });
});
