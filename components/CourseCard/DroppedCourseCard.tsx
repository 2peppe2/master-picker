"use client";

import { useScheduleMutators } from "@/app/dashboard/(store)/schedule/hooks/useScheduleMutators";
import CourseTranslate from "@/common/components/translate/CourseTranslate";
import { scheduleAtoms } from "@/app/dashboard/(store)/schedule/atoms";
import CourseCardFooter from "./CourseCardFooter";
import { Button } from "@/components/ui/button";
import { FC, useMemo, useState } from "react";
import CourseDialog from "../CourseDialog";
import { useAtomValue } from "jotai";
import { CourseCardProps } from ".";
import { X } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DroppedCourseCard: FC<CourseCardProps> = ({ course }) => {
  const { removeCourse } = useScheduleMutators();
  const schedule = useAtomValue(scheduleAtoms.schedulesAtom);

  const canBeAdded = useMemo(
    () =>
      !schedule
        .flatMap((s) => s.flatMap((c) => c.flatMap((d) => d?.code ?? "")))
        .some((c) => c === course.code),
    [course.code, schedule],
  );

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Card
      data-course-code={course.code}
      className="relative w-40 h-40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-grab"
    >
      <CourseDialog
        course={course}
        open={openDialog}
        showAdd={canBeAdded}
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
          <span
            onClick={() => setOpenDialog(true)}
            className="cursor-pointer hover:underline underline-offset-2 text-left"
          >
            {course.code}
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
              className="cursor-pointer text-sm font-medium text-muted-foreground hover:underline underline-offset-2 inline"
            >
              <CourseTranslate text={course.name} />
            </span>
          </div>
        </CardDescription>
      </CardHeader>

      <CourseCardFooter masterPrograms={course.CourseMaster} />
    </Card>
  );
};

export default DroppedCourseCard;
