"use client";

import { TableCell } from "@/components/ui/table";
import { FC } from "react";

interface OccasionBlockCellProps {
  blocks: number[];
}

const OccasionBlockCell: FC<OccasionBlockCellProps> = ({ blocks }) => (
  <TableCell>{blocks.length > 0 ? blocks.join(", ") : "-"}</TableCell>
);

export default OccasionBlockCell;
