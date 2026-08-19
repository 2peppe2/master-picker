"use client";

import { cn } from "@/lib/utils";

import { FC } from "react";
import { Course } from "@/common/types";
import CourseTranslate from "@/common/components/translate/CourseTranslate";
import CourseMetadata from "./CourseMetadata";
import DialogFooter from "./DialogFooter";
import CourseDialogTabs from "./components/CourseDialogTabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCloseAfterCourseAdded } from "./hooks/useCloseAfterCourseAdded";
import type { OccasionActions } from "./types";

interface CourseDialogLargeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  showAdd?: boolean;
  preferredSemesters?: number[];
  occasionActions?: OccasionActions;
}

const CourseDialogLarge: FC<CourseDialogLargeProps> = ({
  open,
  onOpenChange,
  course,
  showAdd = true,
  preferredSemesters,
  occasionActions,
}) => {
  useCloseAfterCourseAdded({
    courseCode: course.code,
    onClose: () => onOpenChange(false),
    open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex h-[min(640px,calc(100dvh-2rem))] w-full",
          "flex-col overflow-hidden p-5 sm:max-w-[39rem] sm:p-6",
        )}
      >
        <DialogHeader className="shrink-0 relative">
          <DialogTitle>{course.code}</DialogTitle>
          <DialogDescription>
            <CourseTranslate text={course.name} />
          </DialogDescription>
          <CourseMetadata course={course} compact />
        </DialogHeader>
        <CourseDialogTabs
          course={course}
          open={open}
          showAdd={showAdd}
          preferredSemesters={preferredSemesters}
          occasionActions={occasionActions}
        />
        <DialogFooter course={course} />
      </DialogContent>
    </Dialog>
  );
};

export default CourseDialogLarge;
