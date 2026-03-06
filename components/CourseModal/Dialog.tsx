import DialogFooterWithDetails from "./DialogFooterWithDetails";
import ExaminationTable from "./ExaminationTable";
import DialogGeneralTab from "./DialogGeneralTab";
import { Course } from "@/app/dashboard/page";
import EvaluateScore from "./EvaluateScore";
import DialogTabs from "./DialogTabs";
import Statistics from "./Statistics";
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
  const tabs = useMemo(
    () => [
      {
        name: "General",
        value: "general",
        content: <DialogGeneralTab course={course} showAdd={showAdd} />,
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
        name: "Evaliuate Score",
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
        </DialogHeader>
        <DialogTabs tabs={tabs} />
        <DialogFooterWithDetails course={course} />
      </DialogContent>
    </Dialog>
  );
};

export default CourseDialog;
