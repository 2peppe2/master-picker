"use client";

import { useEffect, useState, type FC } from "react";
import CourseDialog from ".";
import type { Course } from "@/common/types";

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
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }

    const timeout = window.setTimeout(() => setMounted(false), 250);
    return () => window.clearTimeout(timeout);
  }, [open]);

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
