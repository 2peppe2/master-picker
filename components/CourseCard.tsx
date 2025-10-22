import { Course } from "@/app/courses";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MastersBadge } from "./MastersBadge";
import { Button } from "./ui/button";
import { CourseDialog } from "./CourseDialog";
import { useState } from "react";


type CourseCardProps = Course
const CourseCard: React.FC<CourseCardProps> = ({
  courseCode,
  courseName,
  period,
  credits,
  level,
  block,
  link,
  mastersPrograms,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <Card
      className="w-40 h-40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
    >
      <CourseDialog open={openDialog} onOpenChange={setOpenDialog} course={{ courseCode, courseName, period, credits, level, block, link, mastersPrograms }}/>
        <CardHeader>
          <CardTitle>
            <p
              onClick={() => setOpenDialog(true)}
              className="cursor-pointer hover:underline underline-offset-2"
            >
              {courseCode}
            </p>

          </CardTitle>
          <CardDescription>
            <p
              onClick={() => setOpenDialog(true)}
              className="cursor-pointer hover:underline underline-offset-2"
            >
              {courseName}
            </p></CardDescription>
        </CardHeader>
      <CardFooter>
        {mastersPrograms.map((program) => (
          <MastersBadge key={program} program={program} />
        ))}
      </CardFooter>
    </Card>
  );
};

export { CourseCard };
