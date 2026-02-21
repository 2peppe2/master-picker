import { MasterBadge } from "@/components/MasterBadge";
import { CourseDialog } from "../CourseModal/Dialog";
import { FC, useState } from "react";
import { CourseCardProps } from ".";
import { cn } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface SelectableCourseCardProps extends CourseCardProps {
  onSelectionChange: (courseCode: string | null) => void;
  isSelected: boolean;
}

const SelectableCourseCard: FC<SelectableCourseCardProps> = ({
  course,
  isSelected,
  onSelectionChange,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const masterPrograms = course.CourseMaster || [];

  return (
    <Card className="relative w-40 h-40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <CourseDialog
        course={course}
        open={openDialog}
        onOpenChange={setOpenDialog}
      />

      <button
        onClick={() => onSelectionChange(course.code)}
        className={cn(
          "mt-1 flex h-5 w-5 items-center justify-center rounded-full border transition",
          isSelected ? "border-emerald-600" : "border-muted-foreground/40",
        )}
        aria-hidden
      >
        {isSelected ? (
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
        ) : null}
      </button>
      {/* isSelected
            ? "border-emerald-300 bg-emerald-50/60"
            : "border-muted bg-background", */}

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

export default SelectableCourseCard;
