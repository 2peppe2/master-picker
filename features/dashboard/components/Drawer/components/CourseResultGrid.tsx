"use client";

import { useIsLandscapePhone } from "@/common/hooks/useResponsiveLayout";
import CourseResultGridLandscape from "./CourseResultGridLandscape";
import CourseResultGridStandard from "./CourseResultGridStandard";
import { CourseResultGridProps } from "./CourseResultGrid.types";
import { FC } from "react";

const CourseResultGrid: FC<CourseResultGridProps> = (props) => {
  const isLandscapePhone = useIsLandscapePhone();

  return isLandscapePhone ? (
    <CourseResultGridLandscape {...props} />
  ) : (
    <CourseResultGridStandard {...props} />
  );
};

export default CourseResultGrid;
