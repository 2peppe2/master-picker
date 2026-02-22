import { useScheduleMutators } from "@/app/atoms/schedule/hooks/useScheduleMutators";
import { CourseDialog } from "../CourseModal/Dialog";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import { CourseCardProps } from ".";
import { X } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CourseCardFooter from "./CourseCardFooter";

const DroppedCourseCard: FC<CourseCardProps> = ({ course }) => {
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

      <CourseCardFooter masterPrograms={course.CourseMaster} />
    </Card>
  );
};

export default DroppedCourseCard;
