"use client";

import CourseTranslate from "@/common/components/translate/CourseTranslate";
import CourseCardFooter from "./CourseCardFooter";
import CourseDialog from "../CourseDialog";
import { FC, useState } from "react";
import { CourseCardProps } from ".";
import { cn } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DefaultCourseCard: FC<CourseCardProps> = ({ 
  course,
  selectedOccasionIndex,
  onOccasionChange
}) => {
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
              className="wrap-anywhere hyphens-manual cursor-pointer text-sm font-medium text-muted-foreground hover:underline underline-offset-2 inline"
            >
              <CourseTranslate text={course.name} />
            </span>
          </div>
        </CardDescription>
      </CardHeader>

      <CourseCardFooter masterPrograms={course.CourseMaster} />

      {course.CourseOccasion.length > 1 && (
        <div className="px-4 pb-4 mt-auto">
          <div className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-muted/50 border shadow-inner">
            {course.CourseOccasion.map((occ, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  onOccasionChange?.(idx);
                }}
                className={cn(
                  "flex-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all whitespace-nowrap",
                  selectedOccasionIndex === idx
                    ? "bg-card text-foreground shadow-sm ring-1 ring-foreground/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                )}
              >
                {occ.semester.toLowerCase().includes("autumn") ? "HT" : "VT"}
                {occ.year}
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default DefaultCourseCard;
