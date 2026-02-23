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

type CourseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
};

export const CourseDialog = ({
  open,
  onOpenChange,
  course,
}: CourseDialogProps) => {
  const tabs = [
    {
      name: "General",
      value: "general",
      content: (
        <>
          <DialogGeneralTab course={course} />
          <DialogFooterWithDetails course={course} />
        </>
      ),
    },
    {
      name: "Examinations",
      value: "examinations",
      content: (
        <>
          <ExaminationTable examination={course.Examination} />
          <DialogFooterWithDetails course={course} />
        </>
      ),
    },
    {
      name: "Statistics",
      value: "statistics",
      content: (
        <>
          <Statistics courseCode={course.code} />
          <DialogFooterWithDetails course={course} />
        </>
      ),
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
      </DialogContent>
    </Dialog>
  );
};
