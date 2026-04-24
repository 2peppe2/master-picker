"use client";

import { FC } from "react";
import { Course } from "@/app/dashboard/page";
import { Badge } from "@/components/ui/badge";
import CourseTranslate from "@/common/components/translate/CourseTranslate";
import Translate from "@/common/components/translate/Translate";
import DialogFooter from "./DialogFooter";
import DialogTabs from "./DialogTabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  GraduationCap, 
  NotebookText, 
  CalendarClock, 
  CircleStar,
  ExternalLink,
} from "lucide-react";
import { useCourseDialogState } from "./hooks/useCourseDialogState";
import { Button } from "@/components/ui/button";

interface CourseDialogLargeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  showAdd?: boolean;
}

const CourseDialogLarge: FC<CourseDialogLargeProps> = ({
  open,
  onOpenChange,
  course,
  showAdd = true,
}) => {
  const { activeTab, setActiveTab, setInitModule, tabs } = useCourseDialogState({
    course,
    open,
    showAdd,
  });

  const level = course.level.trim() === "" ? "N/A" : course.level;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[640px] w-full flex-col overflow-hidden sm:max-w-[39rem]">
        <DialogHeader className="shrink-0 relative">
          <DialogTitle>{course.code}</DialogTitle>
          <DialogDescription>
            <CourseTranslate text={course.name} />
          </DialogDescription>
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <Badge
              variant="secondary"
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px]"
            >
              <GraduationCap className="size-3" />
              {course.credits} HP
            </Badge>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px]"
            >
              <CircleStar className="size-3" />
              <Translate text="_course_level" /> {level}
            </Badge>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px]"
            >
              <NotebookText className="size-3" />
              {course.Examination.length}{" "}
              {course.Examination.length > 1 ? (
                <Translate text="_course_module_plural" />
              ) : (
                <Translate text="_course_module_singular" />
              )}
            </Badge>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px]"
            >
              <CalendarClock className="size-3" />
              {course.CourseOccasion.length}{" "}
              {course.CourseOccasion.length > 1 ? (
                <Translate text="_course_occasion_plural" />
              ) : (
                <Translate text="_course_occasion_singular" />
              )}
            </Badge>
          </div>
        </DialogHeader>
        <DialogTabs
          tabs={tabs}
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val);
            if (val !== "statistics") setInitModule(undefined);
          }}
        />
        <DialogFooter course={course} />
      </DialogContent>
    </Dialog>
  );
};

export default CourseDialogLarge;
