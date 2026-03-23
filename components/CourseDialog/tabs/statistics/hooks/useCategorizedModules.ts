"use client";

import { getExpectedExamMonths } from "../../examination/hooks/useLatestOriginalStats";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { EXAM_MODULE_CODES, LAB_MODULE_CODES } from "../constants";
import { ProcessedModule, CourseData } from "../types";
import { Course } from "@/app/dashboard/page";
import { Module } from "liu-tentor-package";
import { useMemo } from "react";

interface UseCategorizedModulesArgs {
  courseData: CourseData | null | undefined;
  course: Course;
}

export const useCategorizedModules = ({
  courseData,
  course,
}: UseCategorizedModulesArgs) => {
  const translate = useCommonTranslate();

  const categorizedModules = useMemo(() => {
    if (!courseData?.modules) return [];

    // Derive expected original months from course occasions
    const expectedMonths = getExpectedExamMonths(course.CourseOccasion);

    const rawGroups = courseData.modules.reduce(
      (acc: Record<string, Module[]>, module: Module) => {
        const code = module.moduleCode;
        if (!acc[code]) acc[code] = [];
        acc[code].push(module);
        return acc;
      },
      {} as Record<string, Module[]>,
    );

    return Object.entries(rawGroups)
      .map(([code, unknownModules]) => {
        const modules = unknownModules as Module[];
        const isExamType = EXAM_MODULE_CODES.some((examCode) =>
          code.startsWith(examCode),
        );
        const isLabType = LAB_MODULE_CODES.some((labCode) =>
          code.startsWith(labCode),
        );

        if (isLabType) {
          const yearGroups: Record<string, ProcessedModule> = {};
          modules.forEach((m) => {
            const year = new Date(m.date).getFullYear().toString();
            if (!yearGroups[year]) {
              yearGroups[year] = {
                ...m,
                date: `${year}-01-01`,
                displayDate: `${translate("summary_of")} ${year}`,
                grades: [],
              };
            }
            m.grades.forEach((g) => {
              const existing = yearGroups[year].grades.find(
                (eg) => eg.grade === g.grade,
              );
              if (existing) existing.quantity += g.quantity;
              else yearGroups[year].grades.push({ ...g });
            });
          });
          return [code, Object.values(yearGroups)] as const;
        }

        if (isExamType) {
          const monthYearGroups: Record<string, ProcessedModule> = {};

          modules.forEach((m) => {
            const d = new Date(m.date);
            const key = `${d.getFullYear()}-${(d.getMonth() + 1)
              .toString()
              .padStart(2, "0")}`;

            if (!monthYearGroups[key]) {
              monthYearGroups[key] = {
                ...m,
                date: `${key}-01`,
                displayDate: d.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                }),
                grades: [],
              };
            }

            m.grades.forEach((g) => {
              const existing = monthYearGroups[key].grades.find(
                (eg) => eg.grade === g.grade,
              );
              if (existing) existing.quantity += g.quantity;
              else monthYearGroups[key].grades.push({ ...g });
            });
          });

          const aggregatedModules = Object.values(monthYearGroups);

          const processed = aggregatedModules.map((m: ProcessedModule) => {
            const month = new Date(m.date).getMonth();
            let isOriginal: boolean;

            if (expectedMonths.size > 0) {
              // Use occasion-derived months
              isOriginal = expectedMonths.has(month);
            } else {
              // Fallback: month with the most students
              const monthTally: Record<number, number> = {};
              aggregatedModules.forEach((am: ProcessedModule) => {
                const am_month = new Date(am.date).getMonth();
                const count = am.grades.reduce(
                  (sum: number, g) => sum + g.quantity,
                  0,
                );
                monthTally[am_month] = (monthTally[am_month] || 0) + count;
              });
              const primaryMonth = Object.entries(monthTally)
                .sort((a, b) => b[1] - a[1])
                .map((entry) => parseInt(entry[0]))[0];
              isOriginal = month === primaryMonth;
            }

            return { ...m, isOriginal };
          });
          return [code, processed] as const;
        }

        return [
          code,
          modules.map((m) => ({
            ...m,
            displayDate: new Date(m.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          })),
        ] as const;
      })
      .sort(([codeA], [codeB]) => {
        const isLabUpgA = /^(LAB|UPG|KTR)/i.test(codeA as string) ? 1 : 0;
        const isLabUpgB = /^(LAB|UPG|KTR)/i.test(codeB as string) ? 1 : 0;

        if (isLabUpgA !== isLabUpgB) return isLabUpgA - isLabUpgB;

        const idxA = course.Examination.findIndex((e) => e.module === codeA);
        const idxB = course.Examination.findIndex((e) => e.module === codeB);
        const pA = idxA === -1 ? 999 : idxA;
        const pB = idxB === -1 ? 999 : idxB;

        if (pA !== pB) return pA - pB;
        return (codeA as string).localeCompare(codeB as string);
      });
  }, [courseData, course.Examination, course.CourseOccasion, translate]);

  const allProcessedModules = useMemo(
    () =>
      categorizedModules.flatMap(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, modules]) => modules as ProcessedModule[],
      ),
    [categorizedModules],
  );

  return {
    categorizedModules: categorizedModules as (readonly [
      string,
      ProcessedModule[],
    ])[],
    allProcessedModules,
  };
};
