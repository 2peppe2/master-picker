"use client";

import { AlertCircle } from "lucide-react";
import CourseCardFooter from "./CourseCardFooter";
import CourseDialog from "../CourseModal/Dialog";
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
  isConflicting,
  conflictingWith,
  selectedOccasionIndex = 0,
  onOccasionChange,
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Card
      className={cn(
        "relative w-40 h-40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
        isConflicting &&
          "border-amber-400 bg-amber-50/50 dark:border-amber-500/50 dark:bg-amber-500/10 shadow-[0_0_0_1px_rgba(251,191,36,0.1)]",
      )}
    >
      {isConflicting && (
        <div className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center text-amber-500 dark:text-amber-400 drop-shadow-sm">
          <AlertCircle className="h-4 w-4" />
        </div>
      )}
      <CourseDialog
        course={course}
        open={openDialog}
        onOpenChange={setOpenDialog}
        showAdd={false}
      />

      <CardHeader>
        <CardTitle>
          {isConflicting && conflictingWith && (
            <div className="absolute -top-2 left-2 right-2 flex justify-center z-10">
              <div className="bg-amber-100 dark:bg-amber-900/90 text-amber-700 dark:text-amber-300 text-[8px] leading-tight font-black py-0.5 px-2 rounded-md border border-amber-300 dark:border-amber-500/50 whitespace-normal text-center shadow-sm backdrop-blur-sm">
                CONFLICT: {conflictingWith.map((c) => `${c.code} (${c.semester} P${c.period} B${c.block})`).join(", ")}
              </div>
            </div>
          )}
          <span
            onClick={() => setOpenDialog(true)}
            className="cursor-pointer hover:underline underline-offset-2 text-left"
          >
            {course.code}
          </span>
        </CardTitle>

        <CardDescription className="p-0 m-0 max-w-full">
          {course.CourseOccasion.length > 1 && isConflicting && (
            <div className="mt-2 flex flex-col gap-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Alternative Occasions:</span>
              <div className="flex flex-wrap gap-1">
                {course.CourseOccasion.map((occ, idx) => {
                  if (idx === selectedOccasionIndex) return null;
                  return (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOccasionChange?.(idx);
                      }}
                      className="text-[9px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 transition-colors"
                    >
                      {occ.semester} P{occ.periods.map(p => p.period).join(",")}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div
            className="line-clamp-2 text-left mt-2"
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

export default DefaultCourseCard;
