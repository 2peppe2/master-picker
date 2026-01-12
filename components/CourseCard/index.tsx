import semesterScheduleAtom, { addCourseToSemesterAtom } from "@/app/atoms/semestersAtom";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { CourseDialog } from "./Dialog";
import { MastersBadge } from "@/components/MastersBadge";
import { Button } from "@/components/ui/button";
import { Course } from "@/app/(main)/page";
import { useSetAtom } from "jotai";

interface CourseCardProps {
  course: Course;
  dropped: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, dropped }) => {
  const { code, name } = course;

  //TODO fix for multiple semesters
  const occasion = course.CourseOccasion[0];
  const masterPrograms = course.CourseMaster || [];
  const addCourse  = useSetAtom(addCourseToSemesterAtom);
  const [openDialog, setOpenDialog] = useState(false);
  const setSemesters = useSetAtom(semesterScheduleAtom);

  const removeCourse = () => {
    setSemesters((prev) => {
      const newSemesters = prev.map((semester) =>
        semester.map((period) =>
          period.map((block) => (block?.code === code ? null : block))
        )
      );
      return newSemesters;
    });
  };

  return (
    <Card className="relative w-40 h-40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
      {dropped ? (
        <Button
          size="icon"
          variant="ghost"
          onClick={removeCourse}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => addCourse({ course, occasion })}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
      <CourseDialog
        course={course}
        open={openDialog}
        onOpenChange={setOpenDialog}
      />
      <CardHeader>
        <CardTitle>
          <p
            onClick={() => setOpenDialog(true)}
            className="cursor-pointer hover:underline underline-offset-2 text-left"
          >
            {code}
          </p>
        </CardTitle>
        <CardDescription className="h-6">
          <p
            onClick={() => setOpenDialog(true)}
            className="cursor-pointer hover:underline underline-offset-2 text-left text-sm"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </p>
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto text-foreground">
        
        <div className="flex justify-center gap-2 w-full">
          {masterPrograms.map((program) => (
            <MastersBadge key={program.master} master={program.master} />
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
