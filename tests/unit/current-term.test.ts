import { describe, expect, it } from "vitest";
import {
  getCurrentAcademicTerm,
  getCurrentTermSemester,
} from "@/features/dashboard/components/Schedule/currentTerm";

describe("current dashboard term", () => {
  it("switches to the autumn term on 15 June", () => {
    expect(getCurrentAcademicTerm(new Date(2026, 5, 14))).toEqual({
      year: 2026,
      semester: "VT",
    });
    expect(getCurrentAcademicTerm(new Date(2026, 5, 15))).toEqual({
      year: 2026,
      semester: "HT",
    });
  });

  it("maps the selected start year to the current visible master term", () => {
    expect(
      getCurrentTermSemester({
        startingYear: 2022,
        visibleSemesters: [6, 7, 8, 9],
        today: new Date(2026, 7, 8),
      }),
    ).toBe(8);
  });

  it("clamps a future programme to its first visible master term", () => {
    expect(
      getCurrentTermSemester({
        startingYear: 2028,
        visibleSemesters: [6, 7, 8, 9],
        today: new Date(2026, 7, 8),
      }),
    ).toBe(6);
  });
});
