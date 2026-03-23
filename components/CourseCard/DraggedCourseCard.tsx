"use client";

import CourseTranslate from "@/common/components/translate/CourseTranslate";
import CourseCardFooter from "./CourseCardFooter";
import { CourseCardProps } from ".";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FC } from "react";

const DraggedCourseCard: FC<CourseCardProps> = ({ course }) => (
  <Card className="w-40 h-40 border-amber-50 border-1 ease-linear cursor-grabbing">
    <CardHeader>
      <CardTitle>
        <span className="cursor-pointer hover:underline underline-offset-2 text-left">
          {course.code}
        </span>
      </CardTitle>

      <CardDescription className="p-0 m-0 max-w-full">
        <div
          className="line-clamp-2 text-left"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
          }}
        >
          <span className="wrap-anywhere hyphens-manual cursor-pointer text-sm font-medium text-muted-foreground hover:underline underline-offset-2 inline">
            <CourseTranslate text={course.name} />
          </span>
        </div>
      </CardDescription>
    </CardHeader>

    <CourseCardFooter masterPrograms={course.CourseMaster} />
  </Card>
);

export default DraggedCourseCard;
