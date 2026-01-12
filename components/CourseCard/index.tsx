import semesterScheduleAtom, {
  addCourseToSemesterAtom,
  removeCourseFromSemesterAtom,
} from "@/app/atoms/semestersAtom";
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
import { MasterBadge } from "@/components/MastersBadge";
import { Button } from "@/components/ui/button";
import { Course, Master } from "@/app/(main)/page";
import { useSetAtom } from "jotai";

interface CourseCardProps {
  course: Course;
  masters: Record<string, Master>;
  dropped: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  masters,
  dropped,
}) => {
  const { code, name } = course;

  //TODO fix for multiple semesters
  const occasion = course.CourseOccasion[0];
  const masterPrograms = course.CourseMaster || [];

  const addCourse = useSetAtom(addCourseToSemesterAtom);
  const removeCourse = useSetAtom(removeCourseFromSemesterAtom);

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Card className="relative w-40 h-40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
      {dropped ? (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => removeCourse({ courseCode: course.code })}
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
        masters={masters}
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
            <MasterBadge
              key={program.master}
              master={masters[program.master]}
            />
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
