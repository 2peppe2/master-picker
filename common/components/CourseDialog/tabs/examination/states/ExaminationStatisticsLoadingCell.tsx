import LoadingDots from "@/common/components/loading/LoadingDots";
import { TableCell } from "@/components/ui/table";
import { Scale } from "@/prisma/generated/client/enums";
import type { FC } from "react";

interface ExaminationStatisticsLoadingCellProps {
  scale: Scale;
}

const ExaminationStatisticsLoadingCell: FC<ExaminationStatisticsLoadingCellProps> = ({
  scale,
}) => (
  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
    <div className="flex gap-2">
      {(scale === Scale.G_OR_U ? ["G", "U"] : ["5", "4", "3", "U"]).map(
        (grade) => (
          <span key={grade}>
            {grade}: <LoadingDots />
          </span>
        ),
      )}
    </div>
  </TableCell>
);

export default ExaminationStatisticsLoadingCell;
