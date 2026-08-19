"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";

import { useCourseCommands } from "@/features/dashboard/state/schedule/hooks/useScheduleCommands";
import CourseCardPresentation from "@/common/components/CourseCard/CourseCardPresentation";
import { Button } from "@/components/ui/button";
import { FC } from "react";
import LazyCourseDialog from "@/common/components/CourseDialog/LazyCourseDialog";
import type { CourseCardProps } from "@/common/components/CourseCard";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCourseCardDialogInteraction } from "@/common/components/CourseCard/hooks/useCourseCardDialogInteraction";

const DroppedCourseCard: FC<CourseCardProps> = ({ course }) => {
  const translate = useCommonTranslate();
  const { removeCourse } = useCourseCommands();

  const {
    openDialog,
    setOpenDialog,
    openCourseDialog,
    handleCoarsePointerCardClick,
  } = useCourseCardDialogInteraction();

  return (
    <Card
      data-course-code={course.code}
      onClick={handleCoarsePointerCardClick}
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
        aria-label={translate("_remove_course", { courseCode: course.code })}
        data-no-drag="true"
        className="absolute right-1 top-1 z-10 size-8 text-muted-foreground hover:text-foreground sm:right-1.5 sm:top-1.5"
      >
        <X className="h-4 w-4" />
      </Button>
      <CourseCardPresentation
        course={course}
        draggable
        onOpen={openCourseDialog}
      />
    </Card>
  );
};

export default DroppedCourseCard;
