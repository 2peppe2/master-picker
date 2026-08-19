"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";

import CourseCardPresentation from "./CourseCardPresentation";
import { Course } from "@/common/types";
import LazyCourseDialog from "../CourseDialog/LazyCourseDialog";
import { FC } from "react";
import { CourseCardProps } from ".";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCourseCardDialogInteraction } from "./hooks/useCourseCardDialogInteraction";

export interface SelectableCourseCardProps extends CourseCardProps {
  onSelectionChange: (course: Course) => void;
  isSelected: boolean;
}

const SelectableCourseCard: FC<SelectableCourseCardProps> = ({
  course,
  isSelected,
  onSelectionChange,
}) => {
  const translate = useCommonTranslate();
  const { openDialog, setOpenDialog, openCourseDialog } =
    useCourseCardDialogInteraction();

  const handleCardClick = (e: React.MouseEvent) => {
    if (openDialog || e.defaultPrevented) return;
    onSelectionChange(course);
  };

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        "hover:scale-[1.02] hover:shadow-md active:scale-95",
        "bg-card text-card-foreground flex flex-col gap-3 rounded-xl border py-4 shadow-sm relative aspect-square w-full max-w-40 sm:h-40 sm:w-40 landscape-phone:h-auto landscape-phone:w-full landscape-phone:max-w-none transition-all duration-200 hover:shadow-lg",
        "relative cursor-pointer group rounded-2xl border text-left transition",
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
      <LazyCourseDialog
        course={course}
        open={openDialog}
        onOpenChange={setOpenDialog}
        showAdd={false}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={translate("_select_course", { courseCode: course.code })}
        aria-pressed={isSelected}
        onClick={(event) => {
          event.stopPropagation();
          onSelectionChange(course);
        }}
        className={cn(
          "absolute right-3 top-3 z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border p-0 transition-all",
          isSelected
            ? "border-emerald-600 ring-2 ring-emerald-600/20 dark:border-emerald-500 dark:ring-emerald-500/20"
            : "border-muted-foreground/30 dark:border-muted-foreground/20",
        )}
      >
        {isSelected && (
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 dark:bg-emerald-500" />
        )}
      </Button>

      <CourseCardPresentation
        course={course}
        onOpen={openCourseDialog}
      />
    </Card>
  );
};

export default SelectableCourseCard;
