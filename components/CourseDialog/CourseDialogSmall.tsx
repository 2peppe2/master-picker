"use client";

import { FC } from "react";
import { Course } from "@/app/dashboard/page";
import { Badge } from "@/components/ui/badge";
import CourseTranslate from "@/common/components/translate/CourseTranslate";
import Translate from "@/common/components/translate/Translate";
import DialogFooter from "./DialogFooter";
import DialogTabs from "./DialogTabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  GraduationCap,
  NotebookText,
  CalendarClock,
  CircleStar,
  ExternalLink,
  X,
} from "lucide-react";
import { useCourseDialogState } from "./hooks/useCourseDialogState";
import { cn } from "@/lib/utils";

interface CourseDialogSmallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  showAdd?: boolean;
}

const CourseDialogSmall: FC<CourseDialogSmallProps> = ({
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex flex-col h-full w-full p-0 overflow-hidden border-none shadow-none"
      >
        <SheetHeader className="shrink-0 pt-12 px-6 pb-2 text-left relative">
          <SheetTitle className="text-3xl font-bold tracking-tight">
            {course.code}
          </SheetTitle>
          <SheetDescription className="text-base text-muted-foreground/80">
            <CourseTranslate text={course.name} />
          </SheetDescription>
          
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <Badge
              variant="secondary"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold"
            >
              <GraduationCap className="size-3.5" />
              {course.credits} HP
            </Badge>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px]"
            >
              <CircleStar className="size-3.5" />
              <Translate text="_course_level" /> {level}
            </Badge>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px]"
            >
              <NotebookText className="size-3.5" />
              {course.Examination.length}{" "}
              {course.Examination.length > 1 ? (
                <Translate text="_course_module_plural" />
              ) : (
                <Translate text="_course_module_singular" />
              )}
            </Badge>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px]"
            >
              <CalendarClock className="size-3.5" />
              {course.CourseOccasion.length}{" "}
              {course.CourseOccasion.length > 1 ? (
                <Translate text="_course_occasion_plural" />
              ) : (
                <Translate text="_course_occasion_singular" />
              )}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0 px-2 mt-4">
          <DialogTabs
            tabs={tabs}
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val);
              if (val !== "statistics") setInitModule(undefined);
            }}
          />
        </div>

        <div className="shrink-0 px-6 py-4 bg-muted/2 mt-auto flex gap-3">
          <a
            href={course.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <button className="w-full h-9 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-wider transition-all active:scale-[0.95] flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
              <Translate text="_course_more_info" />
              <ExternalLink className="size-3" />
            </button>
          </a>
          <SheetClose asChild>
            <button className="flex-1 h-9 rounded-lg bg-muted/50 hover:bg-muted text-[11px] font-bold uppercase tracking-wider text-muted-foreground transition-all active:scale-[0.95] cursor-pointer">
              <Translate text="_course_close" />
            </button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CourseDialogSmall;
