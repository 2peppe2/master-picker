import type { Course, CourseOccasion } from "@/common/types";
import {
  getCourseExaminationTypes,
  type ExaminationType,
} from "@/lib/examinationTypes";
import type { FilterState } from "./atoms";

export interface FilterContext {
  showBachelorYears: boolean;
  masterPeriod: { start: number; end: number };
  translateCourseName: (name: string) => string;
  toRelativeSemester: (
    occasion: Pick<CourseOccasion, "year" | "semester">,
  ) => number;
  hasMatchingOccasion: (args: {
    course: Course;
    periods: number[];
    blocks: number[];
  }) => boolean;
}

interface VisibleSemesterRange {
  start: number;
  end: number;
}

const getVisibleSemesterRange = ({
  masterPeriod,
  showBachelorYears,
}: FilterContext): VisibleSemesterRange => ({
  start: showBachelorYears ? 1 : masterPeriod.start,
  end: masterPeriod.end,
});

const getRelativeSemesters = (
  course: Course,
  toRelativeSemester: FilterContext["toRelativeSemester"],
) => course.CourseOccasion.map((occasion) => toRelativeSemester(occasion) + 1);

const hasSemesterInRange = (
  semesters: number[],
  { start, end }: VisibleSemesterRange,
) => semesters.some((semester) => semester >= start && semester <= end);

const matchesSelectedSemesters = (
  courseSemesters: number[],
  selectedSemesters: number[],
) =>
  selectedSemesters.length === 0 ||
  courseSemesters.some((semester) => selectedSemesters.includes(semester));

const matchesSelectedLevels = (course: Course, selectedLevels: string[]) =>
  selectedLevels.length === 0 ||
  selectedLevels.some((level) =>
    course.level.toLowerCase().includes(level.toLowerCase()),
  );

const matchesSelectedMasters = (course: Course, selectedMasters: string[]) =>
  selectedMasters.length === 0 ||
  course.CourseMaster.some(({ master }) =>
    selectedMasters.some((selectedMaster) => master.includes(selectedMaster)),
  );

const matchesSelectedMainFields = (
  course: Course,
  selectedMainFields: string[],
) =>
  selectedMainFields.length === 0 ||
  course.mainField.some((field) => selectedMainFields.includes(field));

const matchesSelectedPeriods = (course: Course, selectedPeriods: number[]) =>
  selectedPeriods.length === 0 ||
  course.CourseOccasion.some((occasion) =>
    occasion.periods.some(({ period }) => selectedPeriods.includes(period)),
  );

const matchesSelectedBlocks = (course: Course, selectedBlocks: number[]) =>
  selectedBlocks.length === 0 ||
  course.CourseOccasion.some((occasion) =>
    occasion.periods.some(({ blocks }) =>
      blocks.some((block) => selectedBlocks.includes(block)),
    ),
  );

const matchesPeriodAndBlockFilters = (
  course: Course,
  filters: Pick<FilterState, "periods" | "blocks">,
  hasMatchingOccasion: FilterContext["hasMatchingOccasion"],
) => {
  const hasPeriodFilter = filters.periods.length > 0;
  const hasBlockFilter = filters.blocks.length > 0;

  if (hasPeriodFilter && hasBlockFilter) {
    return hasMatchingOccasion({
      course,
      periods: filters.periods,
      blocks: filters.blocks,
    });
  }

  return hasPeriodFilter
    ? matchesSelectedPeriods(course, filters.periods)
    : matchesSelectedBlocks(course, filters.blocks);
};

const matchesSearch = (
  course: Course,
  search: string,
  translateName: FilterContext["translateCourseName"],
) => {
  if (!search) return true;
  const term = search.toLowerCase();
  return [
    translateName(course.name),
    course.code,
    course.examiner,
    course.department,
  ].some((value) => value.toLowerCase().includes(term));
};

const matchesSelectedExaminationTypes = (
  courseTypes: ReadonlySet<ExaminationType>,
  selectedTypes: ExaminationType[],
) =>
  selectedTypes.length === 0 ||
  selectedTypes.some((type) => courseTypes.has(type));

/**
 * "Utan" is the mirror of the matching predicates: a course is dropped when it
 * *does* match one of the excluded values. The matchesSelected* predicates
 * report a match, but treat an empty list as "everything matches" -- so an
 * exclusion only bites once something is actually excluded.
 */
const isExcludedBy = <T>(excluded: T[], matches: (values: T[]) => boolean) =>
  excluded.length > 0 && matches(excluded);

export const courseMatchesFilters = (
  course: Course,
  filters: FilterState,
  context: FilterContext,
): boolean => {
  const relativeSemesters = getRelativeSemesters(
    course,
    context.toRelativeSemester,
  );
  const visibleSemesterRange = getVisibleSemesterRange(context);
  if (!hasSemesterInRange(relativeSemesters, visibleSemesterRange)) {
    return false;
  }

  if (!matchesSelectedSemesters(relativeSemesters, filters.semesters)) {
    return false;
  }

  if (!matchesSelectedLevels(course, filters.levels)) return false;

  if (!matchesSelectedMasters(course, filters.masters)) return false;

  if (!matchesSelectedMainFields(course, filters.mainFields)) return false;

  if (
    !matchesPeriodAndBlockFilters(course, filters, context.hasMatchingOccasion)
  ) {
    return false;
  }

  const filtersExaminations =
    filters.examinationTypes.length > 0 ||
    filters.excludedExaminationTypes.length > 0;

  if (filtersExaminations) {
    const courseTypes = getCourseExaminationTypes(course.Examination);

    if (!matchesSelectedExaminationTypes(courseTypes, filters.examinationTypes))
      return false;

    if (
      isExcludedBy(filters.excludedExaminationTypes, (types) =>
        types.some((type) => courseTypes.has(type)),
      )
    ) {
      return false;
    }
  }

  if (!matchesSearch(course, filters.search, context.translateCourseName)) {
    return false;
  }

  const isExcluded =
    isExcludedBy(filters.excludedSemesters, (semesters) =>
      matchesSelectedSemesters(relativeSemesters, semesters),
    ) ||
    isExcludedBy(filters.excludedLevels, (levels) =>
      matchesSelectedLevels(course, levels),
    ) ||
    isExcludedBy(filters.excludedMasters, (masters) =>
      matchesSelectedMasters(course, masters),
    ) ||
    isExcludedBy(filters.excludedMainFields, (mainFields) =>
      matchesSelectedMainFields(course, mainFields),
    ) ||
    isExcludedBy(filters.excludedPeriods, (periods) =>
      matchesSelectedPeriods(course, periods),
    ) ||
    isExcludedBy(filters.excludedBlocks, (blocks) =>
      matchesSelectedBlocks(course, blocks),
    );

  return !isExcluded;
};
