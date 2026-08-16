import { describe, expect, it, vi } from "vitest";
import type { Course } from "@/common/types";
import {
  DEFAULT_FILTER_STATE,
  type FilterState,
} from "@/features/dashboard/state/filter/atoms";
import {
  courseMatchesFilters,
  type FilterContext,
} from "@/features/dashboard/state/filter/domain";

type Occasion = {
  relativeSemester: number;
  periods: Array<{ period: number; blocks: number[] }>;
};

const createCourse = ({
  CourseMaster = [{ master: "Artificial Intelligence" }],
  CourseOccasion = [
    { relativeSemester: 7, periods: [{ period: 1, blocks: [2] }] },
  ],
  Examination = [{ module: "TEN1" }],
  code = "DD1000",
  department = "Computer Science",
  examiner = "Ada Lovelace",
  level = "Advanced",
  mainField = ["Computer Science"],
  name = "Machine Learning",
}: Partial<{
  CourseMaster: Array<{ master: string }>;
  CourseOccasion: Occasion[];
  Examination: Array<{ module: string }>;
  code: string;
  department: string;
  examiner: string;
  level: string;
  mainField: string[];
  name: string;
}> = {}): Course =>
  ({
    code,
    department,
    examiner,
    level,
    mainField,
    name,
    CourseMaster,
    Examination,
    CourseOccasion: CourseOccasion.map(({ relativeSemester, periods }) => ({
      year: relativeSemester - 1,
      semester: 1,
      periods,
    })),
  }) as unknown as Course;

const createContext = (
  overrides: Partial<FilterContext> = {},
): FilterContext => ({
  showBachelorYears: false,
  masterPeriod: { start: 7, end: 8 },
  translateCourseName: (name) => name,
  toRelativeSemester: (occasion) => occasion.year,
  hasMatchingOccasion: () => true,
  ...overrides,
});

const matches = (
  course: Course,
  filters: Partial<FilterState> = {},
  context: Partial<FilterContext> = {},
) =>
  courseMatchesFilters(
    course,
    { ...DEFAULT_FILTER_STATE, semesters: [], ...filters },
    createContext(context),
  );

const unmatchedFacetFilters: Array<[string, Partial<FilterState>, boolean]> = [
  ["semesters", { semesters: [8] }, false],
  ["levels", { levels: ["basic"] }, false],
  ["masters", { masters: ["Robotics"] }, false],
  ["main fields", { mainFields: ["Mathematics"] }, false],
];

describe("courseMatchesFilters", () => {
  it.each([
    [6, false],
    [7, true],
    [8, true],
    [9, false],
  ])("uses inclusive master visible-range boundaries for semester %i", (semester, expected) => {
    const course = createCourse({
      CourseOccasion: [{ relativeSemester: semester, periods: [] }],
    });

    expect(matches(course)).toBe(expected);
  });

  it("includes bachelor semesters when bachelor years are visible", () => {
    expect(
      matches(
        createCourse({
          CourseOccasion: [{ relativeSemester: 1, periods: [] }],
        }),
        {},
        { showBachelorYears: true },
      ),
    ).toBe(true);
  });

  it.each(unmatchedFacetFilters)("rejects courses that do not match selected %s", (_category, filters, expected) => {
    expect(matches(createCourse(), filters)).toBe(expected);
  });

  it("matches selected semesters, levels, masters, and main fields", () => {
    expect(
      matches(createCourse(), {
        semesters: [7],
        levels: ["advanced"],
        masters: ["Intelligence"],
        mainFields: ["Computer Science"],
      }),
    ).toBe(true);
  });

  it("matches a period without considering its block", () => {
    expect(matches(createCourse(), { periods: [1] })).toBe(true);
    expect(matches(createCourse(), { periods: [2] })).toBe(false);
  });

  it("matches a block without considering its period", () => {
    expect(matches(createCourse(), { blocks: [2] })).toBe(true);
    expect(matches(createCourse(), { blocks: [3] })).toBe(false);
  });

  it("uses an occasion match when both period and block are selected", () => {
    const hasMatchingOccasion = vi.fn(() => true);
    const course = createCourse();

    expect(
      matches(course, { periods: [1], blocks: [2] }, { hasMatchingOccasion }),
    ).toBe(true);
    expect(hasMatchingOccasion).toHaveBeenLastCalledWith({
      course,
      periods: [1],
      blocks: [2],
    });

    hasMatchingOccasion.mockReturnValue(false);

    expect(
      matches(course, { periods: [1], blocks: [2] }, { hasMatchingOccasion }),
    ).toBe(false);
  });

  it.each([
    ["translated name", { search: "inlärning" }, (name: string) => name === "Machine Learning" ? "Maskininlärning" : name],
    ["code", { search: "dd1000" }, undefined],
    ["examiner", { search: "ada" }, undefined],
    ["department", { search: "science" }, undefined],
    ["missing text", { search: "economics" }, undefined],
  ] as const)("searches course %s", (_field, filters, translateCourseName) => {
    expect(
      matches(
        createCourse(),
        filters,
        translateCourseName ? { translateCourseName } : {},
      ),
    ).toBe(_field !== "missing text");
  });

  describe("examination types", () => {
    it("keeps only courses examined by a selected type", () => {
      expect(matches(createCourse(), { examinationTypes: ["written_exam"] })).toBe(
        true,
      );
      expect(matches(createCourse(), { examinationTypes: ["lab"] })).toBe(false);
    });

    it("ors several selected types together", () => {
      expect(
        matches(createCourse(), { examinationTypes: ["lab", "written_exam"] }),
      ).toBe(true);
    });

    it("drops courses carrying an excluded type", () => {
      expect(
        matches(createCourse(), { excludedExaminationTypes: ["written_exam"] }),
      ).toBe(false);
      expect(
        matches(createCourse(), { excludedExaminationTypes: ["lab"] }),
      ).toBe(true);
    });

    it("ignores modules outside the known categories", () => {
      const course = createCourse({ Examination: [{ module: "XYZ9" }] });

      expect(matches(course, { examinationTypes: ["written_exam"] })).toBe(false);
      expect(matches(course, { excludedExaminationTypes: ["written_exam"] })).toBe(
        true,
      );
    });
  });

  describe("exclusions", () => {
    const excludingFilters: Array<[string, Partial<FilterState>]> = [
      ["semesters", { excludedSemesters: [7] }],
      ["levels", { excludedLevels: ["advanced"] }],
      ["masters", { excludedMasters: ["Intelligence"] }],
      ["main fields", { excludedMainFields: ["Computer Science"] }],
      ["periods", { excludedPeriods: [1] }],
      ["blocks", { excludedBlocks: [2] }],
    ];

    it.each(excludingFilters)("drops a course matching excluded %s", (_category, filters) => {
      expect(matches(createCourse(), filters)).toBe(false);
    });

    const nonExcludingFilters: Array<[string, Partial<FilterState>]> = [
      ["semesters", { excludedSemesters: [8] }],
      ["levels", { excludedLevels: ["basic"] }],
      ["masters", { excludedMasters: ["Robotics"] }],
      ["main fields", { excludedMainFields: ["Mathematics"] }],
      ["periods", { excludedPeriods: [2] }],
      ["blocks", { excludedBlocks: [3] }],
    ];

    it.each(nonExcludingFilters)("keeps a course not matching excluded %s", (_category, filters) => {
      expect(matches(createCourse(), filters)).toBe(true);
    });

    it("lets an exclusion override the same value being included", () => {
      expect(
        matches(createCourse(), { levels: ["advanced"], excludedLevels: ["advanced"] }),
      ).toBe(false);
    });

    it("applies exclusions independently of the period-and-block pairing", () => {
      // Both period and block selected routes inclusion through
      // hasMatchingOccasion, but each exclusion still stands on its own.
      expect(
        matches(
          createCourse(),
          { periods: [1], blocks: [2], excludedBlocks: [2] },
          { hasMatchingOccasion: () => true },
        ),
      ).toBe(false);
    });
  });
});
