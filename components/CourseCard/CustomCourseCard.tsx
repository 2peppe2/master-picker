"use client";

import { useScheduleMutators } from "@/app/dashboard/(store)/schedule/hooks/useScheduleMutators";
import { customCoursesAtoms } from "@/app/dashboard/(store)/customCourses/atoms";
import CourseTranslate from "@/common/components/translate/CourseTranslate";
import CustomCourseDialog from "@/components/CustomCourseDialog";
import { CourseCardVariant, CourseCardProps } from "./index";
import { FC, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAtomValue } from "jotai";
import { X } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CustomCourseCardProps extends CourseCardProps {
  variant: CourseCardVariant;
}

const CustomCourseCard: FC<CustomCourseCardProps> = ({ course, variant }) => {
  const { removeCourse } = useScheduleMutators();
  const [openDialog, setOpenDialog] = useState(false);

  const customCoursesParams = useAtomValue(
    customCoursesAtoms.customCoursesAtom,
  );
  const customCourseInput = useMemo(() => {
    return customCoursesParams.find((c) => `custom_${c.code}` === course.code);
  }, [customCoursesParams, course.code]);

  const isGhost = variant === "ghost";
  const isDragged = variant === "dragged";
  const isDropped = variant === "dropped";

  return (
    <Card
      data-course-code={course.code}
      className={`relative w-40 h-40 transition-all duration-300
        ${isGhost ? "opacity-40" : ""}
        ${isDragged ? "scale-[1.05] shadow-xl z-50 cursor-grabbing" : "hover:scale-[1.02] hover:shadow-lg cursor-grab"}
      `}
    >
      <CustomCourseDialog
        courseToEdit={customCourseInput}
        open={openDialog}
        onOpenChange={setOpenDialog}
      />

      {isDropped && (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => removeCourse({ courseCode: course.code })}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground cursor-pointer z-10"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <CardHeader>
        <CardTitle>
          <span
            onClick={() => setOpenDialog(true)}
            className="cursor-pointer hover:underline underline-offset-2 text-left"
          >
            {course.code.replace("custom_", "")}
          </span>
        </CardTitle>

        <CardDescription className="p-0 m-0 max-w-full">
          <div
            className="line-clamp-2 text-left"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
            }}
          >
            <span
              onClick={() => setOpenDialog(true)}
              className="wrap-anywhere hyphens-manual cursor-pointer text-sm font-medium text-muted-foreground hover:underline underline-offset-2 inline"
            >
              <CourseTranslate text={course.name} />
            </span>
          </div>
        </CardDescription>
      </CardHeader>

      <div className="absolute bottom-2 left-0 right-0 px-3 flex justify-between items-center pointer-events-none">
        <span className="text-secondary-foreground text-xs font-bold drop-shadow-sm">
          {course.credits} HP
        </span>
        <span className="bg-secondary/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold text-secondary-foreground border border-border/50 shadow-sm">
          Custom
        </span>
      </div>
    </Card>
  );
};

export default CustomCourseCard;
