"use client";

import ExaminationStatisticsCell from "./cells/ExaminationStatisticsCell";
import ExaminationCreditsCell from "./cells/ExaminationCreditsCell";
import ExaminationModuleCell from "./cells/ExaminationModuleCell";
import ExaminationActionCell from "./cells/ExaminationActionCell";
import ExaminationScaleCell from "./cells/ExaminationScaleCell";
import ExaminationNameCell from "./cells/ExaminationNameCell";
import { CourseExamination } from "@/app/dashboard/page";
import { TableRow } from "@/components/ui/table";
import { Module } from "liu-tentor-package";
import { FC } from "react";

interface ExaminationTableRowProps {
  exam: CourseExamination;
  onNavigateToStatistics: (modCode?: string) => void;
  getLatestStats: (moduleCode: string) => Module | null;
  isLoading: boolean;
}

const ExaminationTableRow: FC<ExaminationTableRowProps> = ({
  exam,
  getLatestStats,
  isLoading,
  onNavigateToStatistics,
}) => {
  const stats = getLatestStats(exam.module);

  return (
    <TableRow className="transition-colors hover:bg-muted/25">
      <ExaminationNameCell name={exam.name} />
      <ExaminationModuleCell module={exam.module} />
      <ExaminationCreditsCell credits={exam.credits} />
      <ExaminationScaleCell scale={exam.scale} />
      <ExaminationStatisticsCell
        scale={exam.scale}
        stats={stats}
        isLoading={isLoading}
      />
      <ExaminationActionCell
        onNavigateToStatistics={() => onNavigateToStatistics?.(exam.module)}
      />
    </TableRow>
  );
};

export default ExaminationTableRow;
