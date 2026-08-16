"use client";

import CourseCardPresentation from "./CourseCardPresentation";
import LazyCourseDialog from "../CourseDialog/LazyCourseDialog";
import { FC, useState } from "react";
import { CourseCardProps } from ".";
import { isCourseCardInteractionBarrier } from "./interactionBarrier";
import { Card } from "@/components/ui/card";

const DefaultCourseCard: FC<CourseCardProps> = ({ course }) => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Card
      onClick={(event) => {
        if (!window.matchMedia("(pointer: coarse)").matches) return;
        if (isCourseCardInteractionBarrier(event.target)) return;
        if ((event.target as HTMLElement).closest("button, a")) return;
        setOpenDialog(true);
      }}
      className="relative aspect-square w-full max-w-40 gap-3 overflow-hidden py-4 transition-all duration-200 hover:shadow-lg pointer-coarse:cursor-pointer sm:h-40 sm:w-40 sm:hover:scale-[1.02] motion-reduce:transition-none"
    >
      <LazyCourseDialog
        course={course}
        open={openDialog}
        onOpenChange={setOpenDialog}
        showAdd={false}
      />

      <CourseCardPresentation course={course} onOpen={() => setOpenDialog(true)} />
    </Card>
  );
};

export default DefaultCourseCard;
