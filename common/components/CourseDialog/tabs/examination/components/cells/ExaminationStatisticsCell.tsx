"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";

import LoadingDots from "@/common/components/loading/LoadingDots";
import { Scale } from "@/prisma/generated/client/enums";
import { TableCell } from "@/components/ui/table";
import { Module } from "liu-tentor-package";
import { FC } from "react";

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
  const translate = useCommonTranslate();
  const getCount = (grade: string) =>
    stats?.grades.find((item: GradeCount) => item.grade === grade)?.quantity ?? 0;

  if (isLoading) {
    return (
      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
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
      </TableCell>
    );
  }

  if (!stats) {
    return (
      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
        -
      </TableCell>
    );
  }

  return (
    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
      <div className="flex gap-2">
        {scale == Scale.G_OR_U ? (
          <>
            <span title={translate("course_pass")}>
              G:{" "}
              {getCount("G") + getCount("3") + getCount("4") + getCount("5")}
            </span>
            <span title={translate("course_fail")}>U: {getCount("U")}</span>
          </>
        ) : (
          <>
            <span title={translate("_grade_n", { grade: 5 })}>
              5: {getCount("5")}
            </span>
            <span title={translate("_grade_n", { grade: 4 })}>
              4: {getCount("4")}
            </span>
            <span title={translate("_grade_n", { grade: 3 })}>
              3: {getCount("3")}
            </span>
            <span title={translate("course_fail")}>U: {getCount("U")}</span>
          </>
        )}
      </div>
    </TableCell>
  );
};

export default ExaminationStatisticsCell;
