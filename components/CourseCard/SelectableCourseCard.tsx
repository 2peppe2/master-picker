import { MasterBadge } from "@/components/MasterBadge";
import { CourseDialog } from "../CourseModal/Dialog";
import { Course } from "@/app/dashboard/page";
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
  onSelectionChange: (course: Course) => void;
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
    <Card
      onClick={() => onSelectionChange(course)}
      className={cn(
        "hover:scale-[1.02] hover:shadow-md active:scale-95",
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm relative w-40 h-40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
        "relative w-40 h-40 cursor-pointer group rounded-2xl border text-left transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "hover:-translate-y-[1px] hover:border-foreground/20 hover:shadow-sm",
        isSelected
          ? "border-emerald-500 bg-emerald-50/60 shadow-[0_0_0_1px_rgba(16,185,129,0.1)]"
          : "border-muted bg-background",
      )}
    >
      <CourseDialog
        course={course}
        open={openDialog}
        onOpenChange={setOpenDialog}
      />

      <button
        className={cn(
          "absolute top-4 right-4 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
          isSelected
            ? "border-emerald-600 ring-2 ring-emerald-600/20 ring-offset-0"
            : "border-muted-foreground/40",
        )}
        aria-hidden
      >
        {isSelected && (
          <span className="h-3.5 w-3.5 rounded-full bg-emerald-600" />
        )}
      </button>

      <CardHeader>
        <CardTitle>
          <p
            onClick={(e) => {
              e.stopPropagation();
              setOpenDialog(true);
            }}
            className="w-fit cursor-pointer hover:underline underline-offset-2 text-left"
          >
            {course.code}
          </p>
        </CardTitle>
        <CardDescription className="h-6">
          <p
            onClick={(e) => {
              e.stopPropagation();
              setOpenDialog(true);
            }}
            className="w-[fit-content] cursor-pointer hover:underline underline-offset-2 text-left text-sm"
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

      <CardFooter className="mt-auto">
        <div className="flex flex-wrap justify-start gap-1 w-full">
          {masterPrograms.map((program) => (
            <MasterBadge name={program.master} key={program.master} />
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SelectableCourseCard;
