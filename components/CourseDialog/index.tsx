"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import Translate from "@/common/components/translate/Translate";
import { FC, useMemo, useState, useEffect } from "react";
import ExaminationTab from "./tabs/examination";
import { Course } from "@/app/dashboard/page";
import { Badge } from "@/components/ui/badge";
import EvaluateScore from "./tabs/evaluate";
import Statistics from "./tabs/statistics";
import OverviewTab from "./tabs/overview";
import DialogFooter from "./DialogFooter";
import DialogTabs from "./DialogTabs";
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
  const translate = useCommonTranslate();
  const level = course.level.trim() === "" ? "N/A" : course.level;
  const [activeTab, setActiveTab] = useState("overview");
  const [initModule, setInitModule] = useState<string | undefined>();
  const [selectedStatModule, setSelectedStatModule] = useState<string>("");

  useEffect(() => {
    if (open) {
      setActiveTab("overview");
      setInitModule(undefined);
      setSelectedStatModule("");
    }
  }, [open, course.code]);

  const tabs = useMemo(
    () => [
      {
        name: translate("_course_tab_overview"),
        value: "overview",
        content: <OverviewTab course={course} showAdd={showAdd} />,
      },
      {
        name: translate("_course_tab_examination"),
        value: "examination",
        content: (
          <ExaminationTab
            course={course}
            onNavigateToStatistics={(modCode?: string) => {
              setInitModule(modCode);
              setActiveTab("statistics");
            }}
          />
        ),
      },
      {
        name: translate("_course_tab_statistics"),
        value: "statistics",
        content: (
          <Statistics
            course={course}
            initialStatModule={initModule}
            selectedModule={selectedStatModule}
            setSelectedModule={setSelectedStatModule}
            onInitialStatConsumed={() => setInitModule(undefined)}
          />
        ),
      },
      {
        name: translate("_course_tab_evaluate"),
        value: "evaliuate-score",
        content: <EvaluateScore courseCode={course.code} />,
      },
    ],
    [course, showAdd, initModule, selectedStatModule, translate],
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

export default CourseDialog;
