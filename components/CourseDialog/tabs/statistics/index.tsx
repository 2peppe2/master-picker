"use client";

import { useDefaultModuleSelection } from "./hooks/useDefaultModuleSelection";
import { useCategorizedModules } from "./hooks/useCategorizedModules";
import { useCourseData } from "../../hooks/useCourseData";
import { useChartData } from "./hooks/useChartData";
import { Loader2, BarChart2 } from "lucide-react";
import Translate from "@/common/components/translate/Translate";
import { Course } from "@/app/dashboard/page";
import { FC, useMemo } from "react";
import StatisticsLarge from "./components/StatisticsLarge";
import StatisticsSmall from "./components/StatisticsSmall";
import { useMediaQuery } from "react-responsive";

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
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
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
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] h-full gap-4 text-muted-foreground w-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm font-medium">
          <Translate text="_course_loading_stats" />
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-destructive w-full">
        <Translate text="_course_stat_error" />
      </div>
    );
  }

  if (!courseData?.modules?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] h-full gap-4 text-muted-foreground w-full">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <BarChart2 className="h-6 w-6 opacity-50" />
        </div>
        <p className="text-sm font-medium">
          <Translate text="_course_stat_none" />
        </p>
      </div>
    );
  }

  const commonProps = {
    selectedModule,
    setSelectedModule,
    categorizedModules,
    selectedItem,
    chartData,
    totalStudents,
  };

  if (isMobile) {
    return <StatisticsSmall {...commonProps} />;
  }

  return <StatisticsLarge {...commonProps} />;
};

export default Statistics;
