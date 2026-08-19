"use client";

import CourseCardPresentation from "./CourseCardPresentation";
import LazyCourseDialog from "../CourseDialog/LazyCourseDialog";
import { FC } from "react";
import { CourseCardProps } from ".";
import { Card } from "@/components/ui/card";
import { useCourseCardDialogInteraction } from "./hooks/useCourseCardDialogInteraction";

const DefaultCourseCard: FC<CourseCardProps> = ({ course }) => {
  const {
    openDialog,
    setOpenDialog,
    openCourseDialog,
    handleCoarsePointerCardClick,
  } = useCourseCardDialogInteraction();

  return (
    <Card
      onClick={handleCoarsePointerCardClick}
      className="relative aspect-square w-full max-w-40 gap-3 overflow-hidden py-4 transition-all duration-200 hover:shadow-lg pointer-coarse:cursor-pointer sm:h-40 sm:w-40 landscape-phone:h-auto landscape-phone:w-full landscape-phone:max-w-none sm:hover:scale-[1.02] motion-reduce:transition-none"
    >
      <LazyCourseDialog
        course={course}
        open={openDialog}
        onOpenChange={setOpenDialog}
        showAdd={false}
      />

      <CourseCardPresentation course={course} onOpen={openCourseDialog} />
    </Card>
  );
};

export default DefaultCourseCard;
