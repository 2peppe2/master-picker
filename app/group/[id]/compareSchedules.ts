import type { GroupMemberCardData } from "./memberScheduleData";

export interface CoursePreview {
  code: string;
  name: string;
  periods: number[];
  semesters: number[];
  matchKey: string;
}

interface CoursePeriodPreview {
  code: string;
  name: string;
  period: number;
  semesters: number[];
  matchKey: string;
}

interface ScheduleComparison {
  sharedCourses: CoursePreview[];
  firstOnlyCourses: CoursePreview[];
  secondOnlyCourses: CoursePreview[];
  overlapPercentage: number;
  unionCount: number;
}

const EMPTY_COMPARISON: ScheduleComparison = {
  sharedCourses: [],
  firstOnlyCourses: [],
  secondOnlyCourses: [],
  overlapPercentage: 0,
  unionCount: 0,
};

export const getNextMemberId = (
  members: GroupMemberCardData[],
  excludedId: string,
) => members.find((member) => member.id !== excludedId)?.id ?? "";

const getSortedUniqueNumbers = (values: number[]) =>
  [...new Set(values)].sort((a, b) => a - b);

const sortCoursesBySemesterAndPeriod = (
  courses: CoursePreview[],
): CoursePreview[] =>
  [...courses].sort((a, b) => {
    const firstSemester = a.semesters[0] ?? Number.MAX_SAFE_INTEGER;
    const secondSemester = b.semesters[0] ?? Number.MAX_SAFE_INTEGER;
    const firstPeriod = a.periods[0] ?? Number.MAX_SAFE_INTEGER;
    const secondPeriod = b.periods[0] ?? Number.MAX_SAFE_INTEGER;

    if (firstSemester !== secondSemester) {
      return firstSemester - secondSemester;
    }

    if (firstPeriod !== secondPeriod) {
      return firstPeriod - secondPeriod;
    }

    return a.code.localeCompare(b.code);
  });

const sortCoursePeriodsBySemesterAndPeriod = (
  courses: CoursePeriodPreview[],
): CoursePeriodPreview[] =>
  [...courses].sort((a, b) => {
    const firstSemester = a.semesters[0] ?? Number.MAX_SAFE_INTEGER;
    const secondSemester = b.semesters[0] ?? Number.MAX_SAFE_INTEGER;

    if (firstSemester !== secondSemester) {
      return firstSemester - secondSemester;
    }

    if (a.period !== b.period) {
      return a.period - b.period;
    }

    return a.code.localeCompare(b.code);
  });

const getComparableCoursePeriods = (
  member: GroupMemberCardData,
): CoursePeriodPreview[] => {
  const coursesByCodeAndPeriod = new Map<string, CoursePeriodPreview>();

  member.scheduledMasterCourses.forEach((course) => {
    const matchKey = `${course.code}:${course.period}`;
    const existingCourse = coursesByCodeAndPeriod.get(matchKey);

    if (existingCourse) {
      existingCourse.semesters = getSortedUniqueNumbers([
        ...existingCourse.semesters,
        course.semester,
      ]);
      return;
    }

    coursesByCodeAndPeriod.set(matchKey, {
      code: course.code,
      name: course.name,
      period: course.period,
      semesters: [course.semester],
      matchKey,
    });
  });

  return sortCoursePeriodsBySemesterAndPeriod([
    ...coursesByCodeAndPeriod.values(),
  ]);
};

const groupCoursePeriods = (
  coursePeriods: CoursePeriodPreview[],
): CoursePreview[] => {
  const coursesByCode = new Map<string, CoursePreview>();

  coursePeriods.forEach((coursePeriod) => {
    const existingCourse = coursesByCode.get(coursePeriod.code);

    if (existingCourse) {
      existingCourse.periods = getSortedUniqueNumbers([
        ...existingCourse.periods,
        coursePeriod.period,
      ]);
      existingCourse.semesters = getSortedUniqueNumbers([
        ...existingCourse.semesters,
        ...coursePeriod.semesters,
      ]);
      return;
    }

    coursesByCode.set(coursePeriod.code, {
      code: coursePeriod.code,
      name: coursePeriod.name,
      periods: [coursePeriod.period],
      semesters: coursePeriod.semesters,
      matchKey: coursePeriod.code,
    });
  });

  return sortCoursesBySemesterAndPeriod([...coursesByCode.values()]);
};

export const compareMemberSchedules = (
  firstMember?: GroupMemberCardData,
  secondMember?: GroupMemberCardData,
): ScheduleComparison => {
  if (!firstMember || !secondMember) {
    return EMPTY_COMPARISON;
  }

  const firstCoursePeriods = getComparableCoursePeriods(firstMember);
  const secondCoursePeriods = getComparableCoursePeriods(secondMember);
  const firstCoursePeriodMap = new Map(
    firstCoursePeriods.map((course) => [course.matchKey, course]),
  );
  const secondCoursePeriodMap = new Map(
    secondCoursePeriods.map((course) => [course.matchKey, course]),
  );
  const sharedCoursePeriods = firstCoursePeriods.flatMap((coursePeriod) => {
    const matchingCoursePeriod = secondCoursePeriodMap.get(
      coursePeriod.matchKey,
    );

    if (!matchingCoursePeriod) {
      return [];
    }

    return [
      {
        ...coursePeriod,
        semesters: getSortedUniqueNumbers([
          ...coursePeriod.semesters,
          ...matchingCoursePeriod.semesters,
        ]),
      },
    ];
  });
  const firstOnlyCoursePeriods = firstCoursePeriods.filter(
    (coursePeriod) => !secondCoursePeriodMap.has(coursePeriod.matchKey),
  );
  const secondOnlyCoursePeriods = secondCoursePeriods.filter(
    (coursePeriod) => !firstCoursePeriodMap.has(coursePeriod.matchKey),
  );
  const unionCount = new Set([
    ...firstCoursePeriods.map((coursePeriod) => coursePeriod.matchKey),
    ...secondCoursePeriods.map((coursePeriod) => coursePeriod.matchKey),
  ]).size;

  return {
    sharedCourses: groupCoursePeriods(sharedCoursePeriods),
    firstOnlyCourses: groupCoursePeriods(firstOnlyCoursePeriods),
    secondOnlyCourses: groupCoursePeriods(secondOnlyCoursePeriods),
    overlapPercentage:
      unionCount > 0
        ? Math.round((sharedCoursePeriods.length / unionCount) * 100)
        : 0,
    unionCount,
  };
};
