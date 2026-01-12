import { MastersBadge } from "@/components/MastersBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import OccasionTable from "./OccasionTable";
import { Course } from "@/app/courses";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{course.code}</DialogTitle>
          <DialogDescription>{course.name}</DialogDescription>
        </DialogHeader>

        <DialogDescription>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label>Examiner:</Label>
              {course.examiner === "" ? "N/A" : course.examiner}
            </div>

            <div>
              <Label>Credits:</Label>
              {course.credits} ECTS
            </div>
            <div>
              <Label>Level:</Label>
              {course.level}
            </div>
          </div>
          <OccasionTable course={course} />
        </DialogDescription>

        <DialogFooter className="sm:justify-between">
          <div>
            {course.CourseMaster.map((program) => (
              <MastersBadge key={program.master} master={program.master} />
            ))}
          </div>

          <a href={course.link} target="_blank" rel="noopener noreferrer">
            <Button type="button" variant="link">
              More Info
            </Button>
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
