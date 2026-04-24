"use client";

import { FC } from "react";
import ModuleSelector from "./ModuleSelector";
import DistributionList from "./DistributionList";
import ChartDistribution from "./ChartDistribution";
import { CategorizedModulesArray, ProcessedModule } from "../types";
import { ChartData } from "./DistributionList";

interface StatisticsSmallProps {
  selectedModule: string;
  setSelectedModule: (mod: string) => void;
  categorizedModules: CategorizedModulesArray;
  selectedItem?: ProcessedModule;
  chartData: ChartData[];
  totalStudents: number;
}

const StatisticsSmall: FC<StatisticsSmallProps> = ({
  selectedModule,
  setSelectedModule,
  categorizedModules,
  selectedItem,
  chartData,
  totalStudents,
}) => {
  return (
    <div className="flex flex-col gap-10 py-6 w-full px-6 pb-20">
      {/* 1. History Selection */}
      <div className="w-full">
        <ModuleSelector
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
          categorizedModules={categorizedModules}
          selectedItem={selectedItem}
        />
      </div>

      {/* 2. Distribution List (Full Space) */}
      <div className="w-full">
        <DistributionList chartData={chartData} totalStudents={totalStudents} />
      </div>

      {/* 3. Visual Graph (Full Space) */}
      <div className="w-full flex justify-center">
        <ChartDistribution 
          chartData={chartData} 
          totalStudents={totalStudents} 
          variant="large" 
        />
      </div>
    </div>
  );
};

export default StatisticsSmall;
