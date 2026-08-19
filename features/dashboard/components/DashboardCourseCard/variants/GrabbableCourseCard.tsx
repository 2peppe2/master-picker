"use client";

import CourseCardPresentation from "@/common/components/CourseCard/CourseCardPresentation";
import CourseAddButton from "../CourseAddButton";
import LazyCourseDialog from "@/common/components/CourseDialog/LazyCourseDialog";
import { FC } from "react";
import type { CourseCardProps } from "@/common/components/CourseCard";
import { Card } from "@/components/ui/card";
import { useCourseCardDialogInteraction } from "@/common/components/CourseCard/hooks/useCourseCardDialogInteraction";
import { useDashboardOccasionActions } from "@/features/dashboard/hooks/useDashboardOccasionActions";
import { semestersAtom } from "@/features/dashboard/state/filter/atoms";
import { useAtomValue } from "jotai";

const GrabbableCourseCard: FC<CourseCardProps> = ({ course }) => {
  const {
    openDialog,
    setOpenDialog,
    openCourseDialog,
    handleCoarsePointerCardClick,
  } = useCourseCardDialogInteraction();
  const preferredSemesters = useAtomValue(semestersAtom);
  const occasionActions = useDashboardOccasionActions();

  return (
    <Card
      onClick={handleCoarsePointerCardClick}
      className="relative aspect-square w-full gap-3 overflow-hidden py-4 transition-all duration-200 hover:shadow-lg pointer-coarse:cursor-pointer lg:cursor-grab lg:hover:scale-[1.02] motion-reduce:transition-none"
    >
      <LazyCourseDialog
        course={course}
        open={openDialog}
        onOpenChange={setOpenDialog}
        preferredSemesters={preferredSemesters}
        occasionActions={occasionActions}
      />
      <CourseAddButton course={course} />

      <CourseCardPresentation
        course={course}
        draggable
        onOpen={openCourseDialog}
      />
    </Card>
  );
};

export default GrabbableCourseCard;
