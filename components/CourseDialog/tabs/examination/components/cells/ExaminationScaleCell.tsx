"use client";

import { Scale } from "@/prisma/generated/client/enums";
import { TableCell } from "@/components/ui/table";
import { FC } from "react";

interface ExaminationScaleCellProps {
  scale: Scale;
}

const ExaminationScaleCell: FC<ExaminationScaleCellProps> = ({ scale }) => (
  <TableCell>
    {scale == Scale.G_OR_U ? "U, G" : "U, 3, 4, 5"}
  </TableCell>
);

export default ExaminationScaleCell;
