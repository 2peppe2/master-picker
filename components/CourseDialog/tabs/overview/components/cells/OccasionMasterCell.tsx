"use client";

import MasterBadge from "@/components/MasterBadge";
import { TableCell } from "@/components/ui/table";
import { FC } from "react";

interface OccasionMasterCellProps {
  recommendedMaster: { master: string }[];
}

const OccasionMasterCell: FC<OccasionMasterCellProps> = ({
  recommendedMaster,
}) => (
  <TableCell>
    {recommendedMaster.length > 0
      ? recommendedMaster.map((m) => (
          <MasterBadge key={m.master} name={m.master} />
        ))
      : "-"}
  </TableCell>
);

export default OccasionMasterCell;
