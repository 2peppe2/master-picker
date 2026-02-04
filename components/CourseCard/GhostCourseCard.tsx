import { Card } from "@/components/ui/card";
import { CourseCardProps } from ".";
import { FC } from "react";

const GhostCourseCard: FC<CourseCardProps> = ({ course }) => (
  <Card
    className="w-40 h-40 border-2 border-dashed border-muted-foreground/30 
               bg-muted/30 shadow-none flex flex-col items-center justify-center 
               opacity-60 transition-opacity"
  >
    <div className="flex flex-col items-center gap-1 select-none grayscale">
      <p className="text-xs font-bold text-muted-foreground/60">
        {course.code}
      </p>
    </div>
  </Card>
);

export default GhostCourseCard;
