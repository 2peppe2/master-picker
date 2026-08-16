"use client";

import CourseCardPresentation from "./CourseCardPresentation";
import { CourseCardProps } from ".";
import { FC } from "react";
import { Card } from "@/components/ui/card";

const GhostCourseCard: FC<CourseCardProps> = ({ course }) => (
  <Card
    aria-hidden="true"
    className="pointer-events-none relative aspect-square w-full gap-3 overflow-hidden border-2 border-muted-foreground/20 bg-muted/30 py-4 opacity-60 shadow-none grayscale transition-opacity lg:h-40 lg:w-40"
  >
    <CourseCardPresentation course={course} inert />
  </Card>
);

export default GhostCourseCard;
