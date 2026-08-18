"use client";

import { useCourseContlictResolver } from "../../ConflictResolverModal/hooks/useCourseContlictResolver";
import { useWildcardExpansion } from "@/features/dashboard/state/schedule/hooks/useScheduleQueries";
import { useConflictManager } from "../../ConflictResolverModal/hooks/useConflictManager";
import ConflictResolverModal from "@/common/components/ConflictResolverModal";
import { semestersAtom } from "@/features/dashboard/state/filter/atoms";
import WildcardExpansionDialog from "../../WildcardExpansionDialog";
import { usePrefersSheet } from "@/common/hooks/useResponsiveLayout";
import OccasionPickerSmall from "./OccasionPickerSmall";
import OccasionPickerLarge from "./OccasionPickerLarge";
import { CourseAddButtonProps } from "./types";
import AddButton from "./components/AddButton";
import { CourseOccasion } from "@/common/types";
import { FC, useState } from "react";
import { useAtomValue } from "jotai";

const CourseAddButton: FC<CourseAddButtonProps> = ({ course }) => {
  const checkWildcardExpansion = useWildcardExpansion();
  const { executeAdd } = useCourseContlictResolver();
  const prefersSheet = usePrefersSheet();
  const preferredSemesters = useAtomValue(semestersAtom);

  const [expansionAlertOpen, setExpansionAlertOpen] = useState(false);
  const [occasionPickerOpen, setOccasionPickerOpen] = useState(false);

  const [selectedOccasion, setSelectedOccasion] = useState<CourseOccasion>(
    course.CourseOccasion[0],
  );

  const { conflictData, conflictOpen, setConflictOpen, showConflictIfNeeded } =
    useConflictManager();

  const isMultiOccasion = course.CourseOccasion.length > 1;

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

  const handleSelect = (occasion: CourseOccasion) => {
    setSelectedOccasion(occasion);
    handleAddAttempt(occasion);
  };

  const OccasionPicker = prefersSheet ? OccasionPickerSmall : OccasionPickerLarge;

  return (
    <>
      {conflictOpen && conflictData && (
        <ConflictResolverModal
          open={conflictOpen}
          setOpen={setConflictOpen}
          conflictData={conflictData}
        />
      )}

      <WildcardExpansionDialog
        open={expansionAlertOpen}
        setOpen={setExpansionAlertOpen}
        courseCode={course.code}
        onConfirm={() =>
          executeAdd({
            course,
            occasion: selectedOccasion,
            strategy: "button",
          })
        }
      />

      {isMultiOccasion ? (
        <OccasionPicker
          course={course}
          isOpen={occasionPickerOpen}
          onOpenChange={setOccasionPickerOpen}
          preferredSemesters={preferredSemesters}
          onSelect={handleSelect}
        />
      ) : (
        <AddButton
          courseCode={course.code}
          onClick={() => handleAddAttempt(course.CourseOccasion[0])}
        />
      )}
    </>
  );
};

export default CourseAddButton;
