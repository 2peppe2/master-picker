"use client";

import Translate from "@/common/components/translate/Translate";
import { FC } from "react";

interface WorkloadChartLabelProps {
  viewBox?: any;
  totalHours: number;
}

const WorkloadChartLabel: FC<WorkloadChartLabelProps> = ({
  viewBox,
  totalHours,
}) => {
  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;

  return (
    <text
      x={viewBox.cx}
      y={viewBox.cy}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      <tspan
        className="fill-foreground text-sm font-medium"
        x={viewBox.cx}
        y={viewBox.cy}
      >
        {totalHours} h
      </tspan>
      <tspan
        className="fill-muted-foreground text-[10px]"
        x={viewBox.cx}
        y={(viewBox.cy || 0) + 13}
      >
        <Translate text="total" />
      </tspan>
    </text>
  );
};

export default WorkloadChartLabel;
