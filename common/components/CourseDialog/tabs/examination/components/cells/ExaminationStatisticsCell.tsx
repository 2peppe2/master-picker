"use client";

import LoadingDots from "@/common/components/loading/LoadingDots";
import { Scale } from "@/prisma/generated/client/enums";
import { TableCell } from "@/components/ui/table";
import { Module } from "liu-tentor-package";
import { FC, useCallback } from "react";

interface GradeCount {
  grade: string;
  quantity: number;
}

interface ExaminationStatisticsCellProps {
  scale: Scale;
  stats: Module | null;
  isLoading: boolean;
}

const ExaminationStatisticsCell: FC<ExaminationStatisticsCellProps> = ({
  scale,
  stats,
  isLoading,
}) => {
  const getCount = useCallback(
    (g: string) => {
      if (!stats) return 0;
      return stats.grades.find((x: GradeCount) => x.grade === g)?.quantity || 0;
    },
    [stats],
  );

  return (
    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
      {isLoading ? (
        <div className="flex gap-2">
          {scale == Scale.G_OR_U ? (
            <>
              <span>
                G: <LoadingDots />
              </span>
              <span>
                U: <LoadingDots />
              </span>
            </>
          ) : (
            <>
              <span>
                5: <LoadingDots />
              </span>
              <span>
                4: <LoadingDots />
              </span>
              <span>
                3: <LoadingDots />
              </span>
              <span>
                U: <LoadingDots />
              </span>
            </>
          )}
        </div>
      ) : stats ? (
        <div className="flex gap-2">
          {scale == Scale.G_OR_U ? (
            <>
              <span title="Pass">
                G:{" "}
                {getCount("G") + getCount("3") + getCount("4") + getCount("5")}
              </span>
              <span title="Fail">U: {getCount("U")}</span>
            </>
          ) : (
            <>
              <span title="Grade 5">5: {getCount("5")}</span>
              <span title="Grade 4">4: {getCount("4")}</span>
              <span title="Grade 3">3: {getCount("3")}</span>
              <span title="Fail">U: {getCount("U")}</span>
            </>
          )}
        </div>
      ) : (
        "-"
      )}
    </TableCell>
  );
};

export default ExaminationStatisticsCell;
