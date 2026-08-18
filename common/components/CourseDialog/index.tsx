"use client";

import { FC } from "react";
import { Course } from "@/common/types";
import {
  useIsLandscapePhone,
  usePrefersSheet,
} from "@/common/hooks/useResponsiveLayout";
import { semestersAtom } from "@/features/dashboard/state/filter/atoms";
import { useAtomValue } from "jotai";
import CourseDialogLandscape from "./CourseDialogLandscape";
import CourseDialogLarge from "./CourseDialogLarge";
import CourseDialogSmall from "./CourseDialogSmall";

interface CourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  showAdd?: boolean;
  preferredSemesters?: number[];
}

const CourseDialog: FC<CourseDialogProps> = (props) => {
  const prefersSheet = usePrefersSheet();
  const isLandscapePhone = useIsLandscapePhone();
  const selectedSemesters = useAtomValue(semestersAtom);
  const preferredSemesters = props.preferredSemesters ?? selectedSemesters;

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
