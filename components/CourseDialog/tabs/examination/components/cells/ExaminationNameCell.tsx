"use client";

import CourseTranslate from "@/common/components/translate/CourseTranslate";
import { TableCell } from "@/components/ui/table";
import { FC } from "react";

interface ExaminationNameCellProps {
  name: string;
}

const ExaminationNameCell: FC<ExaminationNameCellProps> = ({ name }) => (
  <TableCell className="max-w-[150px]">
    <div className="truncate" title={name}>
      <CourseTranslate text={name} />
    </div>
  </TableCell>
);

export default ExaminationNameCell;
