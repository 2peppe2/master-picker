"use client";

import OccasionPickerSmall from "./OccasionPickerSmall";
import CourseAddOverlays from "./components/CourseAddOverlays";
import { useCourseAddFlow } from "./hooks/useCourseAddFlow";
import { CourseAddButtonProps } from "./types";
import { FC } from "react";

const CourseAddButtonSmall: FC<CourseAddButtonProps> = ({ course }) => {
  const flow = useCourseAddFlow(course);

  return (
    <>
      <CourseAddOverlays
        conflictData={flow.conflictData}
        conflictOpen={flow.conflictOpen}
        expansionAlertOpen={flow.expansionAlertOpen}
        courseCode={course.code}
        setConflictOpen={flow.setConflictOpen}
        setExpansionAlertOpen={flow.setExpansionAlertOpen}
        onConfirmExpansion={flow.handleConfirmExpansion}
        onResolveConflict={flow.handleResolveConflict}
      />
      <OccasionPickerSmall
        course={course}
        isOpen={flow.occasionPickerOpen}
        onOpenChange={flow.setOccasionPickerOpen}
        preferredSemesters={flow.preferredSemesters}
        onSelect={flow.handleSelect}
      />
    </>
  );
};

export default CourseAddButtonSmall;
