"use client";

import CourseCardFooter from "./CourseCardFooter";
import CourseDialog from "../CourseModal/Dialog";
import CourseAddButton from "./CourseAddButton";
import { FC, useState } from "react";
import { CourseCardProps } from ".";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const GrabbableCourseCard: FC<CourseCardProps> = ({ course }) => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Card className="relative w-40 h-40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-grab">
      <CourseDialog
        course={course}
        open={openDialog}
        onOpenChange={setOpenDialog}
      />
      <CourseAddButton course={course} />

      <CardHeader>
        <CardTitle>
          <span
            onClick={() => setOpenDialog(true)}
            className="cursor-pointer hover:underline underline-offset-2 text-left"
          >
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
            <span
              onClick={() => setOpenDialog(true)}
              className="cursor-pointer text-sm font-medium text-muted-foreground hover:underline underline-offset-2 inline"
            >
              {course.name}
            </span>
          </div>
        </CardDescription>
      </CardHeader>

      <CourseCardFooter masterPrograms={course.CourseMaster} />
    </Card>
  );
};

export default GrabbableCourseCard;
