"use client";

import type { Course } from "@/common/types";
import { memo, type FC } from "react";
import DraggedCourseCard from "./variants/DraggedCourseCard";
import DroppedCourseCard from "./variants/DroppedCourseCard";
import GhostCourseCard from "./variants/GhostCourseCard";
import GrabbableCourseCard from "./variants/GrabbableCourseCard";

type DashboardCourseCardProps = {
  course: Course;
  variant: "dropped" | "dragged" | "ghost" | "grabbable";
};

const DashboardCourseCardComponent: FC<DashboardCourseCardProps> = ({
  course,
  variant,
}) => {
  switch (variant) {
    case "dropped":
      return <DroppedCourseCard course={course} />;
    case "dragged":
      return <DraggedCourseCard course={course} />;
    case "ghost":
      return <GhostCourseCard course={course} />;
    case "grabbable":
      return <GrabbableCourseCard course={course} />;
  }
};

const DashboardCourseCard = memo(DashboardCourseCardComponent);
DashboardCourseCard.displayName = "DashboardCourseCard";

export default DashboardCourseCard;
