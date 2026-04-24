"use client";

import { FC } from "react";
import { Course } from "@/app/dashboard/page";
import CourseDialogLarge from "./CourseDialogLarge";
import CourseDialogSmall from "./CourseDialogSmall";
import { useMediaQuery } from "react-responsive";

interface CourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  showAdd?: boolean;
}

const CourseDialog: FC<CourseDialogProps> = (props) => {
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });

  if (isMobile) {
    return <CourseDialogSmall {...props} />;
  }

  return <CourseDialogLarge {...props} />;
};

export default CourseDialog;
