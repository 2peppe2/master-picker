"use client";

import { useLatestOriginalStats } from "./hooks/useLatestOriginalStats";
import { useCourseData } from "../../hooks/useCourseData";
import { useIsTouchLayout } from "@/common/hooks/useResponsiveLayout";
import ExaminationTableSmall from "./ExaminationTableSmall";
import ExaminationTableLarge from "./ExaminationTableLarge";
import { ExaminationTableProps } from "./ExaminationTable.types";
import { FC } from "react";

const ExaminationTable: FC<ExaminationTableProps> = ({
  examination,
  courseCode,
  occasions,
  onNavigateToStatistics,
}) => {
  const isTouchLayout = useIsTouchLayout();
  const { data: courseData, isLoading } = useCourseData(courseCode);
  const getLatestStats = useLatestOriginalStats({ courseData, occasions });
  const viewProps = {
    examination,
    getLatestStats,
    isLoading,
    onNavigateToStatistics,
  };

  return isTouchLayout ? (
    <ExaminationTableSmall {...viewProps} />
  ) : (
    <ExaminationTableLarge {...viewProps} />
  );
};

export default ExaminationTable;
