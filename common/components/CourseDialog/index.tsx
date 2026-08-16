"use client";

import { FC } from "react";
import { Course } from "@/common/types";
import { useIsPhone } from "@/common/hooks/useResponsiveLayout";
import { semestersAtom } from "@/features/dashboard/state/filter/atoms";
import { useAtomValue } from "jotai";
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
  const isPhone = useIsPhone();
  const selectedSemesters = useAtomValue(semestersAtom);
  const preferredSemesters = props.preferredSemesters ?? selectedSemesters;

  if (isPhone) {
    return (
      <CourseDialogSmall {...props} preferredSemesters={preferredSemesters} />
    );
  }

  return (
    <CourseDialogLarge {...props} preferredSemesters={preferredSemesters} />
  );
};

export default CourseDialog;
