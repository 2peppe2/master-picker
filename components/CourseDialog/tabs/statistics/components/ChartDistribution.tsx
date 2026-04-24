"use client";

import Translate from "@/common/components/translate/Translate";
import { ChartData } from "./DistributionList";
import { Pie, PieChart, Cell } from "recharts";
import { chartConfig } from "../constants";
import { FC } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface ChartDistributionProps {
  chartData: ChartData[];
  totalStudents: number;
  variant?: "small" | "large";
}

const ChartDistribution: FC<ChartDistributionProps> = ({
  chartData,
  totalStudents,
  variant = "large",
}) => {
  const isSmall = variant === "small";

  return (
    <div className="flex flex-col items-center justify-center">
      <ChartContainer
        config={chartConfig}
        className={cn(
          "aspect-square w-full overflow-visible p-2",
          isSmall ? "max-w-[150px]" : "max-w-[280px]"
        )}
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
            innerRadius={isSmall ? 45 : 75}
            outerRadius={isSmall ? 65 : 100}
            strokeWidth={0}
            cornerRadius={4}
            paddingAngle={chartData.length === 1 ? 0 : isSmall ? 2 : 4}
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
      <p className={cn(
        "text-muted-foreground italic text-center w-full",
        isSmall ? "text-[10px] mt-1" : "text-xs mt-4"
      )}>
        <Translate text="total_students" />: {totalStudents}
      </p>
    </div>
  );
};

export default ChartDistribution;
