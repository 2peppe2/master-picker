"use client";

import { CourseData, ProcessedModule, RawData, GradeMap } from "../types";
import { getConstantColor, GRADE_PRIORITY } from "../constants";
import { useMemo } from "react";

interface UseChartDataArgs {
  courseData: CourseData | null | undefined;
  selectedModule: string;
  selectedItem?: ProcessedModule;
}

export const useChartData = ({
  courseData,
  selectedModule,
  selectedItem,
}: UseChartDataArgs) => {
  const chartData = useMemo(() => {
    if (!courseData?.modules?.length) {
      return [];
    }

    let rawData: RawData[] = [];

    if (selectedModule === "all") {
      const gradeMap = new Map<string, GradeMap>();
      courseData.modules.forEach((m) => {
        m.grades.forEach((g) => {
          const existing = gradeMap.get(g.grade);
          gradeMap.set(g.grade, {
            q: (existing?.q ?? 0) + g.quantity,
            o: g.gradeOrder,
          });
        });
      });

      rawData = Array.from(gradeMap.entries()).map(([grade, d]) => ({
        grade,
        quantity: d.q,
        gradeOrder: d.o,
      }));
    } else {
      if (!selectedItem) {
        return [];
      }

      rawData = selectedItem.grades.map((g) => ({
        grade: g.grade,
        quantity: g.quantity,
        gradeOrder: g.gradeOrder,
      }));
    }

    return rawData
      .map((d) => ({ ...d, fill: getConstantColor(d.grade) }))
      .sort((a, b) => {
        const pA = GRADE_PRIORITY[a.grade.toUpperCase()] ?? 99;
        const pB = GRADE_PRIORITY[b.grade.toUpperCase()] ?? 99;
        return pA - pB;
      });
  }, [courseData, selectedModule, selectedItem]);

  const totalStudents = chartData.reduce((acc, curr) => acc + curr.quantity, 0);

  return { chartData, totalStudents };
};
