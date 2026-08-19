"use client";

import { useDefaultModuleSelection } from "./hooks/useDefaultModuleSelection";
import { useCategorizedModules } from "./hooks/useCategorizedModules";
import { useCourseData } from "../../hooks/useCourseData";
import { useChartData } from "./hooks/useChartData";
import { Course } from "@/common/types";
import { FC, useMemo } from "react";
import StatisticsLayout from "./components/StatisticsLayout";
import StatisticsLoadingState from "./states/StatisticsLoadingState";
import StatisticsErrorState from "./states/StatisticsErrorState";
import StatisticsEmptyState from "./states/StatisticsEmptyState";

interface StatisticsProps {
  course: Course;
  initialStatModule?: string;
  selectedModule: string;
  setSelectedModule: (mod: string) => void;
  onInitialStatConsumed?: () => void;
}

const Statistics: FC<StatisticsProps> = ({
  course,
  initialStatModule,
  selectedModule,
  setSelectedModule,
  onInitialStatConsumed,
}) => {
  const { data: courseData, isLoading, error } = useCourseData(course.code);

  const { categorizedModules, allProcessedModules } = useCategorizedModules({
    courseData,
    course,
  });

  useDefaultModuleSelection({
    course,
    allProcessedModules,
    initialStatModule,
    selectedModule,
    setSelectedModule,
    onInitialStatConsumed,
  });

  const selectedItem = useMemo(
    () =>
      allProcessedModules.find(
        (m) => `${m.moduleCode}-${m.date}` === selectedModule,
      ),
    [allProcessedModules, selectedModule],
  );

  const { chartData, totalStudents } = useChartData({
    courseData,
    selectedModule,
    selectedItem,
  });

  if (isLoading) {
    return <StatisticsLoadingState />;
  }

  if (error) {
    return <StatisticsErrorState />;
  }

  if (!courseData?.modules?.length) {
    return <StatisticsEmptyState />;
  }

  const commonProps = {
    selectedModule,
    setSelectedModule,
    categorizedModules,
    selectedItem,
    chartData,
    totalStudents,
  };

  return <StatisticsLayout {...commonProps} />;
};

export default Statistics;
