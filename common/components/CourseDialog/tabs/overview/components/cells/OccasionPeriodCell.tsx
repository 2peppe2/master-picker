"use client";

import { TableCell } from "@/components/ui/table";
import { FC } from "react";

interface OccasionPeriodCellProps {
  periods: number[];
}

const OccasionPeriodCell: FC<OccasionPeriodCellProps> = ({ periods }) => (
  <TableCell>{periods.length > 0 ? periods.join(", ") : "-"}</TableCell>
);

export default OccasionPeriodCell;
