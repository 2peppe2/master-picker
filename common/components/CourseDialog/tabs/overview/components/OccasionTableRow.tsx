"use client";

import OccasionSemesterCell from "./cells/OccasionSemesterCell";
import { CourseOccasion } from "@/common/types";
import OccasionPeriodCell from "./cells/OccasionPeriodCell";
import OccasionMasterCell from "./cells/OccasionMasterCell";
import OccasionActionCell from "./cells/OccasionActionCell";
import OccasionBlockCell from "./cells/OccasionBlockCell";
import { TableRow } from "@/components/ui/table";
import { FC } from "react";

interface OccasionTableRowProps {
  occasion: CourseOccasion;
  showRecommendedMaster: boolean;
  showAdd: boolean;
  onAdd: () => void;
}

const OccasionTableRow: FC<OccasionTableRowProps> = ({
  occasion,
  showRecommendedMaster,
  showAdd,
  onAdd,
}) => {
  const periods = occasion.periods.map((p) => p.period);
  const blocks = Array.from(new Set(occasion.periods.flatMap((p) => p.blocks)));

  return (
    <TableRow className="transition-colors hover:bg-muted/25">
      <OccasionSemesterCell year={occasion.year} semester={occasion.semester} />
      <OccasionPeriodCell periods={periods} />
      <OccasionBlockCell blocks={blocks} />
      {showRecommendedMaster && (
        <OccasionMasterCell recommendedMaster={occasion.recommendedMaster} />
      )}
      {showAdd && <OccasionActionCell onAdd={onAdd} />}
    </TableRow>
  );
};

export default OccasionTableRow;
