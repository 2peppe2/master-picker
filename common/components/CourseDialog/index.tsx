"use client";

import { FC } from "react";
import { Course } from "@/common/types";
import {
  useIsLandscapePhone,
  usePrefersSheet,
} from "@/common/hooks/useResponsiveLayout";
import CourseDialogLandscape from "./CourseDialogLandscape";
import CourseDialogLarge from "./CourseDialogLarge";
import CourseDialogSmall from "./CourseDialogSmall";
import type { OccasionActions } from "./types";

interface CourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  showAdd?: boolean;
  preferredSemesters?: number[];
  occasionActions?: OccasionActions;
}

const CourseDialog: FC<CourseDialogProps> = (props) => {
  const prefersSheet = usePrefersSheet();
  const isLandscapePhone = useIsLandscapePhone();
  const preferredSemesters = props.preferredSemesters ?? [];

  // The two are mutually exclusive by construction -- usePrefersSheet is
  // "phone and not landscape" -- so the order here is safe either way.
  if (prefersSheet) {
    return (
      <CourseDialogSmall {...props} preferredSemesters={preferredSemesters} />
    );
  }

  if (isLandscapePhone) {
    return (
      <CourseDialogLandscape
        {...props}
        preferredSemesters={preferredSemesters}
      />
    );
  }

  return (
    <CourseDialogLarge {...props} preferredSemesters={preferredSemesters} />
  );
};

export default CourseDialog;
