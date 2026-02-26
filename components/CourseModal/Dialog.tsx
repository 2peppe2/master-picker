import DialogFooterWithDetails from "./DialogFooterWithDetails";
import DialogGeneralTab from "./DialogGeneralTab";
import { Course } from "@/app/dashboard/page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ExaminationTable from "./ExaminationTable";
import DialogTabs from "./DialogTabs";
import Statistics from "./Statistics";
import EvaluateScore from "./EvaluateScore";

type CourseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  showAdd? : boolean;
};

export const CourseDialog = ({
  open,
  onOpenChange,
  course,
  showAdd = true,
}: CourseDialogProps) => {
  const tabs = [
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
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-xl no-drag"
        onPointerDownCapture={(e) => e.stopPropagation()}
        onMouseDownCapture={(e) => e.stopPropagation()}
        onTouchStartCapture={(e) => e.stopPropagation()}
      >
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
