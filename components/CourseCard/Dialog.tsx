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
import { Course, Master } from "@/app/(main)/page";
import { Suspense } from "react";
import { MasterBadge } from "../MastersBadge";

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
  const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl no-drag">
        <DialogHeader>
          <DialogTitle>{course.code}</DialogTitle>
          <DialogDescription>{course.name}</DialogDescription>
        </DialogHeader>

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

        <DialogFooter className="sm:justify-between">
          <div>
            {course.CourseMaster.map((program) => (
              <MasterBadge key={program.master} name={program.master} />
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
