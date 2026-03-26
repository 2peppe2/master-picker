"use client";

import { useCourseTranslate } from "@/common/components/translate/hooks/useCourseTranslate";
import CourseTranslate from "@/common/components/translate/CourseTranslate";
import { TableCell } from "@/components/ui/table";
import { FC } from "react";

interface ExaminationNameCellProps {
  name: string;
}

const ExaminationNameCell: FC<ExaminationNameCellProps> = ({ name }) => {
  const translateCourse = useCourseTranslate();

  return (
    <TableCell className="max-w-[150px]">
      <div className="truncate" title={translateCourse(name)}>
        <CourseTranslate text={name} />
      </div>
    </TableCell>
  );
};

export default ExaminationNameCell;
