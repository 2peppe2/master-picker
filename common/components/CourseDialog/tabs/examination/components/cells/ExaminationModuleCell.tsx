"use client";

import { TableCell } from "@/components/ui/table";
import { FC } from "react";

interface ExaminationModuleCellProps {
  module: string;
}

const ExaminationModuleCell: FC<ExaminationModuleCellProps> = ({ module }) => (
  <TableCell>{module}</TableCell>
);

export default ExaminationModuleCell;
