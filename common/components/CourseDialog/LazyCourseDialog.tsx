"use client";

import { type FC } from "react";
import CourseDialog from ".";
import type { Course } from "@/common/types";
import { useDelayedUnmount } from "@/common/hooks/useDelayedUnmount";
import type { OccasionActions } from "./types";

interface LazyCourseDialogProps {
  course: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showAdd?: boolean;
  preferredSemesters?: number[];
  occasionActions?: OccasionActions;
}

const LazyCourseDialog: FC<LazyCourseDialogProps> = ({
  course,
  open,
  onOpenChange,
  showAdd,
  preferredSemesters,
  occasionActions,
}) => {
  const mounted = useDelayedUnmount(open, 250);

  if (!mounted && !open) return null;

  return (
    <CourseDialog
      course={course}
      open={open}
      onOpenChange={onOpenChange}
      showAdd={showAdd}
      preferredSemesters={preferredSemesters}
      occasionActions={occasionActions}
    />
  );
};

export default LazyCourseDialog;
