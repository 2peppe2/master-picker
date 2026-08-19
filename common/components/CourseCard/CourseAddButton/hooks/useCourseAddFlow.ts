"use client";

import { useCourseContlictResolver } from "../../../ConflictResolverModal/hooks/useCourseContlictResolver";
import { useWildcardExpansion } from "@/features/dashboard/state/schedule/hooks/useScheduleQueries";
import { useConflictManager } from "../../../ConflictResolverModal/hooks/useConflictManager";
import { semestersAtom } from "@/features/dashboard/state/filter/atoms";
import { Course, CourseOccasion } from "@/common/types";
import { useState } from "react";
import { useAtomValue } from "jotai";

export const useCourseAddFlow = (course: Course) => {
  const checkWildcardExpansion = useWildcardExpansion();
  const { executeAdd } = useCourseContlictResolver();
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
    handleConfirmExpansion: () =>
      executeAdd({
        course,
        occasion: selectedOccasion,
        strategy: "button",
      }),
  };
};
