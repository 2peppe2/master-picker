import { Course } from "@/app/dashboard/page";
import { MasterBadge } from "../MasterBadge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FC } from "react";

interface GhostCourseCardProps {
  course: Course;
}

const GhostCourseCard: FC<GhostCourseCardProps> = ({ course }) => (
  <Card className="w-40 h-40 border-amber-50 border-1 ease-linear cursor-grabbing">
    <CardHeader>
      <CardTitle>
        <p className="text-left">{course.code}</p>
      </CardTitle>
      <CardDescription className="h-6">
        <p
          className="text-left text-sm"
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
        {(course.CourseMaster || []).map((program) => (
          <MasterBadge name={program.master} key={program.master} />
        ))}
      </div>
    </CardFooter>
  </Card>
);

export default GhostCourseCard;
