"use client";

import { EXAM_MODULE_CODES, LAB_MODULE_CODES } from "../constants";
import { Course } from "@/app/dashboard/page";
import { useState, useEffect } from "react";
import { ProcessedModule } from "../types";

interface UseDefaultModuleSelectionArgs {
  course: Course;
  allProcessedModules: ProcessedModule[];
  initialStatModule?: string;
  selectedModule: string;
  setSelectedModule: (mod: string) => void;
  onInitialStatConsumed?: () => void;
}

export const useDefaultModuleSelection = ({
  course,
  allProcessedModules,
  initialStatModule,
  selectedModule,
  setSelectedModule,
  onInitialStatConsumed,
}: UseDefaultModuleSelectionArgs) => {
  const [hasSetDefault, setHasSetDefault] = useState(false);

  useEffect(() => {
    // Navigation from examination table: jump to the latest original for a specific module
    if (initialStatModule && allProcessedModules.length > 0) {
      const exams = allProcessedModules.filter(
        (m) => m.moduleCode === initialStatModule,
      );
      if (exams.length > 0) {
        const originalExams = exams.filter((m) => m.isOriginal);
        const targetExams = originalExams.length > 0 ? originalExams : exams;
        const sortedExams = [...targetExams].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        setSelectedModule(
          `${sortedExams[0].moduleCode}-${sortedExams[0].date}`,
        );
      } else {
        setSelectedModule("all");
      }
      onInitialStatConsumed?.();
      return;
    }

    // Auto-default: only run once, and only when no module is yet selected
    if (
      allProcessedModules.length > 0 &&
      !hasSetDefault &&
      !initialStatModule &&
      selectedModule === ""
    ) {
      const findLatestForCode = (moduleCode: string): string | null => {
        const sessions = allProcessedModules.filter(
          (m) => m.moduleCode === moduleCode,
        );
        if (!sessions.length) return null;
        const originalSessions = sessions.filter((m) => m.isOriginal);
        const target =
          originalSessions.length > 0 ? originalSessions : sessions;
        const sorted = [...target].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        return `${sorted[0].moduleCode}-${sorted[0].date}`;
      };

      // Step 1: Iterate course.Examination in order, skip lab-type modules
      for (const exam of course.Examination) {
        const isLab = LAB_MODULE_CODES.some((code) =>
          exam.module.startsWith(code),
        );
        if (isLab) continue;

        const mod = findLatestForCode(exam.module);
        if (mod) {
          setSelectedModule(mod);
          setHasSetDefault(true);
          return;
        }
      }

      // Step 2: No exam-type modules had data — fall back to first lab in examination order
      for (const exam of course.Examination) {
        const isLab = LAB_MODULE_CODES.some((code) =>
          exam.module.startsWith(code),
        );
        if (!isLab) continue;

        const mod = findLatestForCode(exam.module);
        if (mod) {
          setSelectedModule(mod);
          setHasSetDefault(true);
          return;
        }
      }

      // Step 3: Nothing found — show all
      setSelectedModule("all");
      setHasSetDefault(true);
    }
  }, [
    allProcessedModules,
    course.Examination,
    hasSetDefault,
    initialStatModule,
    onInitialStatConsumed,
    selectedModule,
    setSelectedModule,
  ]);
};
