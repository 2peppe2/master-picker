"use client";

import Translate from "@/common/components/translate/Translate";
import type { FC } from "react";
import type { CategorizedModulesArray, ProcessedModule } from "../types";
import DistributionList, { type ChartData } from "./DistributionList";
import ModuleSelector from "./ModuleSelector";

interface StatisticsLayoutProps {
  selectedModule: string;
  setSelectedModule: (module: string) => void;
  categorizedModules: CategorizedModulesArray;
  selectedItem?: ProcessedModule;
  chartData: ChartData[];
  totalStudents: number;
}

const StatisticsLayout: FC<StatisticsLayoutProps> = ({
  selectedModule,
  setSelectedModule,
  categorizedModules,
  selectedItem,
  chartData,
  totalStudents,
}) => (
  <div className="w-full space-y-6 py-3 sm:py-6 landscape-phone:space-y-4 landscape-phone:py-3">
    <ModuleSelector
      selectedModule={selectedModule}
      setSelectedModule={setSelectedModule}
      categorizedModules={categorizedModules}
      selectedItem={selectedItem}
    />

    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-medium text-foreground">
          <Translate text="distribution" />
        </h3>
        <span className="text-xs text-muted-foreground">
          <Translate text="_total_students" />: {totalStudents}
        </span>
      </div>
      <DistributionList chartData={chartData} totalStudents={totalStudents} />
    </section>
  </div>
);

export default StatisticsLayout;
