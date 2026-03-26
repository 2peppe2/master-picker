"use client";

import { TableCell } from "@/components/ui/table";
import { FC } from "react";

interface ExaminationCreditsCellProps {
  credits: number | string;
}

const ExaminationCreditsCell: FC<ExaminationCreditsCellProps> = ({ credits }) => (
  <TableCell>{credits} HP</TableCell>
);

export default ExaminationCreditsCell;
