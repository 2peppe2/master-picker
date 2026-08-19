"use client";

import CourseCardPresentation from "@/common/components/CourseCard/CourseCardPresentation";
import type { CourseCardProps } from "@/common/components/CourseCard";
import { FC } from "react";
import { Card } from "@/components/ui/card";

const GhostCourseCard: FC<CourseCardProps> = ({ course }) => (
  <Card
    aria-hidden="true"
    className="pointer-events-none relative aspect-square w-full gap-3 overflow-hidden border-2 border-muted-foreground/20 bg-muted/30 py-4 opacity-60 shadow-none grayscale transition-opacity"
  >
    <CourseCardPresentation course={course} inert />
  </Card>
);

export default GhostCourseCard;
