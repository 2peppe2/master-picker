"use client";

import CourseTranslate from "@/common/components/translate/CourseTranslate";
import CourseCardFooter from "./CourseCardFooter";
import { Course } from "@/app/dashboard/page";
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

export interface SelectableCourseCardProps extends CourseCardProps {
  onSelectionChange: (course: Course) => void;
  onOccasionChange: (index: number) => void;
  isSelected: boolean;
  selectedOccasionIndex: number;
}

const SelectableCourseCard: FC<SelectableCourseCardProps> = ({
  course,
  isSelected,
  selectedOccasionIndex,
  onSelectionChange,
  onOccasionChange,
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if (openDialog || e.defaultPrevented) return;
    onSelectionChange(course);
  };

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        "hover:scale-[1.02] hover:shadow-md active:scale-95",
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm relative w-40 h-40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
        "relative w-40 h-40 cursor-pointer group rounded-2xl border text-left transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "hover:-translate-y-[1px] hover:border-foreground/20 hover:shadow-sm",
        isSelected
          ? [
              "border-emerald-500 bg-emerald-50/60 shadow-[0_0_0_1px_rgba(16,185,129,0.1)]",
              "dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:shadow-[0_0_0_1px_rgba(16,185,129,0.2)]",
            ]
          : "border-muted hover:border-foreground/20 dark:hover:border-foreground/40",
      )}
    >
      <CourseDialog
        course={course}
        open={openDialog}
        onOpenChange={setOpenDialog}
        showAdd={false}
      />

      <div
        className={cn(
          "absolute right-3 top-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
          isSelected
            ? "border-emerald-600 ring-2 ring-emerald-600/20 dark:border-emerald-500 dark:ring-emerald-500/20"
            : "border-muted-foreground/30 dark:border-muted-foreground/20",
        )}
      >
        {isSelected && (
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 dark:bg-emerald-500" />
        )}
      </div>

      <CardHeader>
        <CardTitle>
          <span
            onClick={(e) => {
              e.stopPropagation();
              setOpenDialog(true);
            }}
            className="w-fit cursor-pointer hover:underline underline-offset-2 text-left"
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
              onClick={(e) => {
                e.stopPropagation();
                setOpenDialog(true);
              }}
              className="wrap-anywhere hyphens-auto cursor-pointer text-sm font-medium text-muted-foreground hover:underline underline-offset-2 inline"
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
                  onOccasionChange(idx);
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

export default SelectableCourseCard;
