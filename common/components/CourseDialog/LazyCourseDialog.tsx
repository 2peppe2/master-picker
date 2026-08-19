"use client";

import { type FC } from "react";
import CourseDialog from ".";
import type { Course } from "@/common/types";
import { useDelayedUnmount } from "@/common/hooks/useDelayedUnmount";

interface LazyCourseDialogProps {
  course: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showAdd?: boolean;
}

const LazyCourseDialog: FC<LazyCourseDialogProps> = ({
  course,
  open,
  onOpenChange,
  showAdd,
}) => {
  const mounted = useDelayedUnmount(open, 250);

  if (!mounted && !open) return null;

  return (
    <CourseDialog
      course={course}
      open={open}
      onOpenChange={onOpenChange}
      showAdd={showAdd}
    />
  );
};

export default LazyCourseDialog;
