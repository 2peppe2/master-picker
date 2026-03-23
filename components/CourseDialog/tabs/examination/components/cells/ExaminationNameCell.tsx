"use client";

import { TableCell } from "@/components/ui/table";
import { FC } from "react";

interface ExaminationNameCellProps {
  name: string;
}

const ExaminationNameCell: FC<ExaminationNameCellProps> = ({ name }) => (
  <TableCell>
    {name.length <= 18 ? name : name.substring(0, 18) + "..."}
  </TableCell>
);

export default ExaminationNameCell;
