"use client";

import { CourseOccasion } from "@/app/dashboard/page";
import { CourseData } from "../../statistics/types";
import { Module } from "liu-tentor-package";
import { useMemo } from "react";

export interface UseLatestOriginalStatsArgs {
  courseData: CourseData | null | undefined;
  occasions?: CourseOccasion[];
}

export const useLatestOriginalStats = ({
  courseData,
  occasions,
}: UseLatestOriginalStatsArgs) => {
  const expectedMonths = useMemo(
    () => (occasions ? getExpectedExamMonths(occasions) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(occasions)],
  );

  return useMemo(
    () =>
      (moduleCode: string) =>
        getLatestOriginalStat(courseData?.modules, moduleCode, expectedMonths),
    [courseData, expectedMonths],
  );
};

/**
 * Derives the set of expected "original" exam months from the course occasions.
 *
 * For each occasion, we look at the LATEST period the course runs in —
 * because the exam always falls at the end of the last period, not at the
 * end of each individual period.
 *
 * Mapping (0-indexed JS months) by semester × max period:
 *   HT, max period 1 → October  (9)
 *   HT, max period 2 → January  (0)   [next calendar year]
 *   VT, max period 1 → March    (2)
 *   VT, max period 2 → May (4) + June (5)
 *
 * When a course appears in multiple occasions (e.g. both HT and VT),
 * months from all occasions are unioned — each offering has its own original sitting.
 */
export const getExpectedExamMonths = (
  occasions: CourseOccasion[],
): Set<number> => {
  const months = new Set<number>();
  for (const occasion of occasions) {
    if (!occasion.periods.length) continue;
    const maxPeriod = Math.max(...occasion.periods.map((p) => p.period));
    if (occasion.semester === "HT") {
      if (maxPeriod === 1) months.add(9); // October
      if (maxPeriod >= 2) months.add(0);  // January
    } else {
      // VT
      if (maxPeriod === 1) months.add(2); // March
      if (maxPeriod >= 2) { months.add(4); months.add(5); } // May / June
    }
  }
  return months;
};

/**
 * Returns the latest original session for a given module code, with grades
 * aggregated across all raw entries for the same month-year (matching the
 * same aggregation that the Statistics tab uses via useCategorizedModules).
 *
 * When `expectedMonths` is provided (derived from course occasions), a session
 * is considered original if it falls in one of those months.
 *
 * Falls back to the "month with the most students" heuristic when no occasion
 * data is available.
 *
 * Returns null when no modules are found for the given code.
 */
export const getLatestOriginalStat = (
  modules: Module[] | null | undefined,
  moduleCode: string,
  expectedMonths?: Set<number>,
): Module | null => {
  if (!modules) return null;
  const moduleExams = modules.filter((m) => m.moduleCode === moduleCode);
  if (!moduleExams.length) return null;

  let originalExams: Module[];

  if (expectedMonths && expectedMonths.size > 0) {
    const byOccasion = moduleExams.filter((m) =>
      expectedMonths.has(new Date(m.date).getMonth()),
    );
    originalExams = byOccasion.length > 0 ? byOccasion : moduleExams;
  } else {
    // Fallback: month with the most students is the original sitting
    const monthTally: Record<number, number> = {};
    moduleExams.forEach((m) => {
      const month = new Date(m.date).getMonth();
      const count = m.grades.reduce((sum, g) => sum + g.quantity, 0);
      monthTally[month] = (monthTally[month] || 0) + count;
    });
    const primaryMonth = Object.entries(monthTally)
      .sort((a, b) => b[1] - a[1])
      .map((entry) => parseInt(entry[0]))[0];
    const byStudents = moduleExams.filter(
      (m) => new Date(m.date).getMonth() === primaryMonth,
    );
    originalExams = byStudents.length > 0 ? byStudents : moduleExams;
  }

  // Find the latest month-year among original exams
  const sortedByDate = [...originalExams].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const latestRef = sortedByDate[0];
  const latestD = new Date(latestRef.date);
  const latestKey = `${latestD.getFullYear()}-${latestD.getMonth()}`;

  // Collect all raw entries from that same month-year
  const sameMonthYear = originalExams.filter((m) => {
    const d = new Date(m.date);
    return `${d.getFullYear()}-${d.getMonth()}` === latestKey;
  });

  if (sameMonthYear.length === 1) return sameMonthYear[0];

  // Aggregate grades across all entries in that month-year (same as Statistics tab)
  const gradeMap = new Map<string, { grade: string; quantity: number; gradeOrder: number }>();
  sameMonthYear.forEach((m) => {
    m.grades.forEach((g) => {
      const existing = gradeMap.get(g.grade);
      if (existing) {
        existing.quantity += g.quantity;
      } else {
        gradeMap.set(g.grade, { ...g });
      }
    });
  });

  return {
    ...latestRef,
    grades: Array.from(gradeMap.values()),
  };
};
