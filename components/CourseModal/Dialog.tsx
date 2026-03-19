"use client";

import DialogFooterWithDetails from "./DialogFooterWithDetails";
import { FC, useMemo, useState, useEffect } from "react";
import DialogGeneralTab from "./DialogGeneralTab";
import DialogDetailsTab from "./DialogDetailsTab";
import { Course } from "@/app/dashboard/page";
import { Badge } from "@/components/ui/badge";
import EvaluateScore from "./EvaluateScore";
import DialogTabs from "./DialogTabs";
import Statistics from "./statistics";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  GraduationCap,
  NotebookText,
  CalendarClock,
  CircleStar,
} from "lucide-react";

interface CourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  showAdd?: boolean;
}

const CourseDialog: FC<CourseDialogProps> = ({
  open,
  onOpenChange,
  course,
  showAdd = true,
}) => {
  const level = course.level.trim() === "" ? "N/A" : course.level;
  const [activeTab, setActiveTab] = useState("overview");
  const [initialStatModule, setInitialStatModule] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (open) {
      setActiveTab("overview");
      setInitialStatModule(undefined);
    }
  }, [open, course.code]);

  const tabs = useMemo(
    () => [
      {
        name: "Overview",
        value: "overview",
        content: <DialogGeneralTab course={course} showAdd={showAdd} />,
      },
      {
        name: "Examination",
        value: "examination",
        content: (
          <DialogDetailsTab
            course={course}
            onNavigateToStatistics={(modCode?: string) => {
              setInitialStatModule(modCode);
              setActiveTab("statistics");
            }}
          />
        ),
      },
      {
        name: "Statistics",
        value: "statistics",
        content: (
          <Statistics course={course} initialStatModule={initialStatModule} />
        ),
      },
      {
        name: "Evaliuate Score",
        value: "evaliuate-score",
        content: <EvaluateScore courseCode={course.code} />,
      },
    ],
    [course, showAdd, initialStatModule],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[640px] w-full flex-col overflow-hidden sm:max-w-[39rem]">
        <DialogHeader className="shrink-0">
          <DialogTitle>{course.code}</DialogTitle>
          <DialogDescription>{course.name}</DialogDescription>
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
              Level {level}
            </Badge>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px]"
            >
              <NotebookText className="size-3" />
              {course.Examination.length}{" "}
              {course.CourseOccasion.length > 1 ? "modules" : "module"}
            </Badge>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px]"
            >
              <CalendarClock className="size-3" />
              {course.CourseOccasion.length}{" "}
              {course.CourseOccasion.length > 1 ? "occasions" : "occasion"}
            </Badge>
          </div>
        </DialogHeader>
        <DialogTabs
          tabs={tabs}
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val);
            if (val !== "statistics") setInitialStatModule(undefined);
          }}
        />
        <DialogFooterWithDetails course={course} />
      </DialogContent>
    </Dialog>
  );
};

export default CourseDialog;
