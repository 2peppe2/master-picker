"use client";

import CourseCardPresentation from "@/common/components/CourseCard/CourseCardPresentation";
import type { CourseCardProps } from "@/common/components/CourseCard";
import { Card } from "@/components/ui/card";
import { FC } from "react";

const DraggedCourseCard: FC<CourseCardProps> = ({ course }) => (
  <Card
    aria-hidden="true"
    className="pointer-events-none h-40 w-40 cursor-grabbing gap-3 py-4"
  >
    <CourseCardPresentation course={course} inert />
  </Card>
);

export default DraggedCourseCard;
