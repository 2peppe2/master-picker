import DialogFooterWithDetails from "./DialogFooterWithDetails";
import ExaminationTable from "./ExaminationTable";
import DialogGeneralTab from "./DialogGeneralTab";
import DialogDetailsTab from "./DialogDetailsTab";
import { Course } from "@/app/dashboard/page";
import EvaluateScore from "./EvaluateScore";
import DialogTabs from "./DialogTabs";
import Statistics from "./Statistics";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, NotebookText, CalendarClock, CircleStar } from "lucide-react";
import { FC, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  const tabs = useMemo(
    () => [
      {
        name: "Plan",
        value: "plan",
        content: <DialogGeneralTab course={course} showAdd={showAdd} />,
      },
      {
        name: "Workload",
        value: "details",
        content: <DialogDetailsTab course={course} />,
      },
      {
        name: "Examinations",
        value: "examinations",
        content: <ExaminationTable examination={course.Examination} />,
      },
      {
        name: "Statistics",
        value: "statistics",
        content: <Statistics courseCode={course.code} />,
      },
      {
        name: "Evaluate Score",
        value: "evaluate-score",
        content: <EvaluateScore courseCode={course.code} />,
      },
    ],
    [course, showAdd],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[39rem]" data-no-drag="true">
        <DialogHeader>
          <DialogTitle>{course.code}</DialogTitle>
          <DialogDescription>{course.name}</DialogDescription>
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <Badge
              variant="secondary"
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px]"
            >
              <GraduationCap className="size-3" />
              {course.credits} ECTS
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
              {course.Examination.length} modules
            </Badge>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px]"
            >
              <CalendarClock className="size-3" />
              {course.CourseOccasion.length} occasions
            </Badge>
          </div>
        </DialogHeader>
        <DialogTabs tabs={tabs} />
        <DialogFooterWithDetails course={course} />
      </DialogContent>
    </Dialog>
  );
};

export default CourseDialog;
