"use client";

import { Course } from "@/app/dashboard/page";
import { useState, useEffect } from "react";
import { ProcessedModule } from "../types";

interface UseDefaultModuleSelectionArgs {
  course: Course;
  allProcessedModules: ProcessedModule[];
  initialStatModule?: string;
}

export const useDefaultModuleSelection = ({
  course,
  allProcessedModules,
  initialStatModule,
}: UseDefaultModuleSelectionArgs) => {
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [hasSetDefault, setHasSetDefault] = useState(false);

  useEffect(() => {
    if (initialStatModule && allProcessedModules.length > 0) {
      const exams = allProcessedModules.filter(
        (m) => m.moduleCode === initialStatModule,
      );
      if (exams.length > 0) {
        const sortedExams = [...exams].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        setSelectedModule(
          `${sortedExams[0].moduleCode}-${sortedExams[0].date}`,
        );
      } else {
        setSelectedModule("all");
      }
      return;
    }

    if (
      allProcessedModules.length > 0 &&
      !hasSetDefault &&
      !initialStatModule
    ) {
      const expectedMonths = new Set<number>();
      for (const occasion of course.CourseOccasion) {
        for (const p of occasion.periods) {
          if (occasion.semester === "HT" && p.period === 1) {
            expectedMonths.add(9);
          }
          if (occasion.semester === "HT" && p.period === 2) {
            expectedMonths.add(0);
          }
          if (occasion.semester === "VT" && p.period === 1) {
            expectedMonths.add(2);
          }
          if (occasion.semester === "VT" && p.period === 2) {
            expectedMonths.add(4).add(5);
          }
        }
      }

      const exams = allProcessedModules.filter(
        (m) => !/^(LAB|UPG|KTR)/i.test(m.moduleCode),
      );
      const now = new Date();
      let defaultMod = "all";

      if (exams.length > 0) {
        const sortedExams = [...exams].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        let found = false;
        for (const exam of sortedExams) {
          const edate = new Date(exam.date);
          if (edate <= now && expectedMonths.has(edate.getMonth())) {
            defaultMod = `${exam.moduleCode}-${exam.date}`;
            found = true;
            break;
          }
        }

        if (!found) {
          const pastExams = sortedExams.filter((e) => new Date(e.date) <= now);
          if (pastExams.length > 0) {
            defaultMod = `${pastExams[0].moduleCode}-${pastExams[0].date}`;
          } else {
            defaultMod = `${sortedExams[0].moduleCode}-${sortedExams[0].date}`;
          }
        }
      }

      setSelectedModule(defaultMod);
      setHasSetDefault(true);
    }
  }, [
    allProcessedModules,
    course.CourseOccasion,
    hasSetDefault,
    initialStatModule,
  ]);

  return { selectedModule, setSelectedModule };
};
