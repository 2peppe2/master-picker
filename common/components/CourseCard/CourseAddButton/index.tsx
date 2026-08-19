"use client";

import { usePrefersSheet } from "@/common/hooks/useResponsiveLayout";
import CourseAddButtonSmall from "./CourseAddButtonSmall";
import CourseAddButtonLarge from "./CourseAddButtonLarge";
import CourseAddButtonSingle from "./CourseAddButtonSingle";
import { CourseAddButtonProps } from "./types";
import { FC } from "react";

const CourseAddButton: FC<CourseAddButtonProps> = ({ course }) => {
  const prefersSheet = usePrefersSheet();

  if (course.CourseOccasion.length <= 1) {
    return <CourseAddButtonSingle course={course} />;
  }

  return prefersSheet ? (
    <CourseAddButtonSmall course={course} />
  ) : (
    <CourseAddButtonLarge course={course} />
  );
};

export default CourseAddButton;
