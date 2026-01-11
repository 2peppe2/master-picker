import { CourseWithOccasion } from "@/app/(main)/types";
import { Course } from "@/app/courses";
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

type CourseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: CourseWithOccasion;
};

export const CourseDialog = ({
  open,
  onOpenChange,
  course,
}: CourseDialogProps) => {
  //TODO fix for multiple semesters
  const occasion = course.CourseOccasion?.[0];
  const period = occasion?.periods ?? [];
  const block = occasion?.blocks ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{course.code}</DialogTitle>
          <DialogDescription>{course.name}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <Label>Period:</Label>
            <p>
              {period.length > 1
                ? `Periods ${period.map((p) => p.period).join(" and ")}`
                : `Period ${period[0]?.period ?? "-"}`}
            </p>
          </div>
          <div>
            <Label>Credits:</Label>
            <p>{course.credits} ECTS</p>
          </div>
          <div>
            <Label>Level:</Label>
            <p>{course.level}</p>
          </div>
          <div>
            <Label>Block:</Label>
            <p>Block {block[0]?.block ?? "-"}</p>
          </div>
        </div>

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
