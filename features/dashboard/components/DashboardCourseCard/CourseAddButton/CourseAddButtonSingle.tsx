"use client";

import CourseAddOverlays from "./components/CourseAddOverlays";
import { useCourseAddFlow } from "./hooks/useCourseAddFlow";
import AddButton from "./components/AddButton";
import { CourseAddButtonProps } from "./types";
import { FC } from "react";

const CourseAddButtonSingle: FC<CourseAddButtonProps> = ({ course }) => {
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
      <AddButton
        courseCode={course.code}
        onClick={() => flow.handleAddAttempt(course.CourseOccasion[0])}
      />
    </>
  );
};

export default CourseAddButtonSingle;
