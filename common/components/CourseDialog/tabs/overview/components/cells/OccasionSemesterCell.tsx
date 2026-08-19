"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { useToRelativeSemester } from "@/common/hooks/useToRelativeSemester";
import { Semester } from "@/prisma/generated/client/enums";
import { TableCell } from "@/components/ui/table";
import { FC } from "react";

interface OccasionSemesterCellProps {
  year: number;
  semester: Semester;
}

const OccasionSemesterCell: FC<OccasionSemesterCellProps> = ({
  year,
  semester,
}) => {
  const yearAndSemesterToRelativeSemester = useToRelativeSemester();
  const translate = useCommonTranslate();

  const relativeSemester = yearAndSemesterToRelativeSemester({ year, semester });

  return (
    <TableCell>
      {relativeSemester + 1} ({translate(semester)} {year})
    </TableCell>
  );
};

export default OccasionSemesterCell;
