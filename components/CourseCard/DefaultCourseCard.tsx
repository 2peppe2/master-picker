"use client";

import CourseTranslate from "@/common/components/translate/CourseTranslate";
import CourseCardFooter from "./CourseCardFooter";
import CourseDialog from "../CourseDialog";
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
        showAdd={false}
      />

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
              <CourseTranslate text={course.name} />
            </span>
          </div>
        </CardDescription>
      </CardHeader>

      <CourseCardFooter masterPrograms={course.CourseMaster} />
    </Card>
  );
};

export default DefaultCourseCard;
