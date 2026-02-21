import { useScheduleMutators } from "@/app/atoms/schedule/hooks/useScheduleMutators";
import { MasterBadge } from "@/components/MasterBadge";
import { CourseDialog } from "../CourseModal/Dialog";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import { CourseCardProps } from ".";
import { X } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DroppedCourseCard: FC<CourseCardProps> = ({ course }) => {
  const masterPrograms = course.CourseMaster || [];

  const { removeCourse } = useScheduleMutators();

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Card
      data-course-code={course.code}
      className="relative w-40 h-40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-grab"
    >
      <CourseDialog
        course={course}
        open={openDialog}
        onOpenChange={setOpenDialog}
      />
      <Button
        size="icon"
        variant="ghost"
        onClick={() => removeCourse({ courseCode: course.code })}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground cursor-pointer"
      >
        <X className="h-4 w-4" />
      </Button>

      <CardHeader>
        <CardTitle>
          <p
            onClick={() => setOpenDialog(true)}
            className="cursor-pointer hover:underline underline-offset-2 text-left"
          >
            {course.code}
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
            {course.name}
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

export default DroppedCourseCard;
