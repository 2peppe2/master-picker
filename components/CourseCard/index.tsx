import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X } from "lucide-react";
import { useState } from "react";
import { CourseDialog } from "./courseDialog/Dialog";
import { MasterBadge } from "@/components/MasterBadge";
import { Button } from "@/components/ui/button";
import { Course } from "@/app/(main)/page";
import { useScheduleStore } from "@/app/atoms/scheduleStore";
import CourseAddButton from "./CourseAddButton";

interface CourseCardProps {
  course: Course;
  dropped: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, dropped }) => {
  const { code, name } = course;

  const masterPrograms = course.CourseMaster || [];

  const { mutators } = useScheduleStore();

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Card className="relative w-40 h-40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
      {dropped ? (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => mutators.removeCourse({ courseCode: course.code })}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : (
        <CourseAddButton course={course} />
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
            <MasterBadge name={program.master} key={program.master} />
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
