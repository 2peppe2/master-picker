"use client";

import { useCourseConflictResolver } from "@/features/dashboard/hooks/useCourseConflictResolver";
import { useWildcardExpansion } from "@/features/dashboard/state/schedule/hooks/useScheduleQueries";
import { useConflictManager } from "@/features/dashboard/hooks/useConflictManager";
import { semestersAtom } from "@/features/dashboard/state/filter/atoms";
import { Course, CourseOccasion } from "@/common/types";
import { useState } from "react";
import { useAtomValue } from "jotai";

export const useCourseAddFlow = (course: Course) => {
  const checkWildcardExpansion = useWildcardExpansion();
  const { executeAdd, resolveConflict } = useCourseConflictResolver();
  const preferredSemesters = useAtomValue(semestersAtom);
  const [expansionAlertOpen, setExpansionAlertOpen] = useState(false);
  const [occasionPickerOpen, setOccasionPickerOpen] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState<CourseOccasion>(
    course.CourseOccasion[0],
  );
  const { conflictData, conflictOpen, setConflictOpen, showConflictIfNeeded } =
    useConflictManager();

  const handleAddAttempt = (occasion: CourseOccasion) => {
    if (showConflictIfNeeded({ course, occasion, strategy: "button" })) {
      setOccasionPickerOpen(false);
      return;
    }

    if (checkWildcardExpansion({ occasion })) {
      setSelectedOccasion(occasion);
      setExpansionAlertOpen(true);
      setOccasionPickerOpen(false);
      return;
    }

    executeAdd({ course, occasion, strategy: "button" });
    setOccasionPickerOpen(false);
  };

  return {
    conflictData,
    conflictOpen,
    expansionAlertOpen,
    occasionPickerOpen,
    preferredSemesters,
    setConflictOpen,
    setExpansionAlertOpen,
    setOccasionPickerOpen,
    handleAddAttempt,
    handleSelect: handleAddAttempt,
    handleResolveConflict: (type: "replace" | "extra") => {
      if (conflictData) resolveConflict({ ...conflictData, type });
    },
    handleConfirmExpansion: () =>
      executeAdd({
        course,
        occasion: selectedOccasion,
        strategy: "button",
      }),
  };
};
