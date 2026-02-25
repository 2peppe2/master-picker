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

  const handleCardClick = (e: React.MouseEvent) => {
    if(openDialog || e.defaultPrevented) return;
    onSelectionChange(course);
  }

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        "hover:scale-[1.02] hover:shadow-md active:scale-95",
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm relative w-40 h-40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
        "relative w-40 h-40 cursor-pointer group rounded-2xl border text-left transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "hover:-translate-y-[1px] hover:border-foreground/20 hover:shadow-sm",
        isSelected
          ? [
              "border-emerald-500 bg-emerald-50/60 shadow-[0_0_0_1px_rgba(16,185,129,0.1)]",
              "dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:shadow-[0_0_0_1px_rgba(16,185,129,0.2)]",
            ]
          : "border-muted hover:border-foreground/20 dark:hover:border-foreground/40",
      )}
    >
      <CourseDialog
        course={course}
        open={openDialog}
        onOpenChange={setOpenDialog}
        showAdd={false}
      />

      <div
        className={cn(
          "absolute right-3 top-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
          isSelected
            ? "border-emerald-600 ring-2 ring-emerald-600/20 dark:border-emerald-500 dark:ring-emerald-500/20"
            : "border-muted-foreground/30 dark:border-muted-foreground/20",
        )}
        aria-hidden
      >
        {isSelected && (
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 dark:bg-emerald-500" />
        )}
      </div>

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
            className="w-fit text-left text-sm"
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
