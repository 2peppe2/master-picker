"use client";

import { FC } from "react";
import ModuleSelector from "./ModuleSelector";
import DistributionList from "./DistributionList";
import ChartDistribution from "./ChartDistribution";
import { CategorizedModulesArray, ProcessedModule } from "../types";
import { ChartData } from "./DistributionList";

interface StatisticsLargeProps {
  selectedModule: string;
  setSelectedModule: (mod: string) => void;
  categorizedModules: CategorizedModulesArray;
  selectedItem?: ProcessedModule;
  chartData: ChartData[];
  totalStudents: number;
}

const StatisticsLarge: FC<StatisticsLargeProps> = ({
  selectedModule,
  setSelectedModule,
  categorizedModules,
  selectedItem,
  chartData,
  totalStudents,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
      <div className="flex flex-col gap-6">
        <ModuleSelector
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
          categorizedModules={categorizedModules}
          selectedItem={selectedItem}
        />
        <DistributionList chartData={chartData} totalStudents={totalStudents} />
      </div>

      <ChartDistribution chartData={chartData} totalStudents={totalStudents} variant="large" />
    </div>
  );
};

export default StatisticsLarge;
