import { CourseCardProps } from ".";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FC } from "react";
import CourseCardFooter from "./CourseCardFooter";

const DraggedCourseCard: FC<CourseCardProps> = ({ course }) => (
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

    <CourseCardFooter masterPrograms={course.CourseMaster} />
  </Card>
);

export default DraggedCourseCard;
