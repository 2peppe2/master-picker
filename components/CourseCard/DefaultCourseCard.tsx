"use client";

import { CourseDialog } from "../CourseModal/Dialog";
import CourseCardFooter from "./CourseCardFooter";
import { FC, useState } from "react";
import { CourseCardProps } from ".";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DefaultCourseCard: FC<CourseCardProps> = ({ course }) => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Card className="relative w-40 h-40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <CourseDialog
        course={course}
        open={openDialog}
        onOpenChange={setOpenDialog}
      />

      <CardHeader>
        <CardTitle>
          <p
            onClick={() => setOpenDialog(true)}
            className="cursor-pointer hover:underline underline-offset-2 text-left"
          >
            {course.code}
          </p>
        </CardTitle>
        <CardDescription className="h-6">
          <p
            onClick={() => setOpenDialog(true)}
            className="cursor-pointer hover:underline underline-offset-2 text-left text-sm"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {course.name}
          </p>
        </CardDescription>
      </CardHeader>

      <CourseCardFooter masterPrograms={course.CourseMaster || []} />
    </Card>
  );
};

export default DefaultCourseCard;
