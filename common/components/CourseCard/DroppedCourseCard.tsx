"use client";

import { useCourseCommands } from "@/features/dashboard/state/schedule/hooks/useScheduleCommands";
import CourseCardPresentation from "./CourseCardPresentation";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import LazyCourseDialog from "../CourseDialog/LazyCourseDialog";
import { CourseCardProps } from ".";
import { X } from "lucide-react";
import { isCourseCardInteractionBarrier } from "./interactionBarrier";
import { Card } from "@/components/ui/card";

const DroppedCourseCard: FC<CourseCardProps> = ({ course }) => {
  const { removeCourse } = useCourseCommands();

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Card
      data-course-code={course.code}
      onClick={(event) => {
        if (!window.matchMedia("(pointer: coarse)").matches) return;
        if (isCourseCardInteractionBarrier(event.target)) return;
        if ((event.target as HTMLElement).closest("button, a")) return;
        setOpenDialog(true);
      }}
      className="relative h-full w-full gap-3 overflow-hidden py-4 transition-all duration-200 hover:shadow-lg pointer-coarse:cursor-pointer lg:cursor-grab lg:hover:scale-[1.02] motion-reduce:transition-none"
    >
      <LazyCourseDialog
        course={course}
        open={openDialog}
        showAdd={false}
        onOpenChange={setOpenDialog}
      />

      <Button
        size="icon"
        variant="ghost"
        onClick={() => removeCourse({ courseCode: course.code })}
        aria-label={`Remove ${course.code}`}
        data-no-drag="true"
        className="absolute right-1 top-1 z-10 size-8 text-muted-foreground hover:text-foreground sm:right-1.5 sm:top-1.5"
      >
        <X className="h-4 w-4" />
      </Button>
      <CourseCardPresentation
        course={course}
        draggable
        onOpen={() => setOpenDialog(true)}
      />
    </Card>
  );
};

export default DroppedCourseCard;
