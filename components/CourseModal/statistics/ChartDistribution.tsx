"use client";

import { ChartData } from "./DistributionList";
import { Pie, PieChart, Cell } from "recharts";
import { chartConfig } from "./constants";
import { FC } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartDistributionProps {
  chartData: ChartData[];
  totalStudents: number;
}

const ChartDistribution: FC<ChartDistributionProps> = ({
  chartData,
  totalStudents,
}) => (
  <div className="flex flex-col items-center justify-center">
    <ChartContainer
      config={chartConfig}
      className="aspect-square w-full max-w-[280px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="quantity"
          nameKey="grade"
          innerRadius={75}
          outerRadius={100}
          strokeWidth={0}
          cornerRadius={4}
          paddingAngle={chartData.length === 1 ? 0 : 4}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.fill}
              className="hover:opacity-80 transition-opacity outline-none"
            />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
    <p className="text-xs text-muted-foreground mt-4 italic">
      Total students: {totalStudents}
    </p>
  </div>
);

export default ChartDistribution;
