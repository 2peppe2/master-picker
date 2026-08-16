"use client";

import { cn } from "@/lib/utils";

import { FC } from "react";

export interface ChartData {
  grade: string;
  quantity: number;
  gradeOrder: number;
  fill: string;
}

interface DistributionListProps {
  chartData: ChartData[];
  totalStudents: number;
}

const DistributionList: FC<DistributionListProps> = ({
  chartData,
  totalStudents,
}) => {
  const maxQuantity = Math.max(...chartData.map((item) => item.quantity), 1);

  return (
    <div className="space-y-3">
      {chartData.map((item) => (
        <DistributionBar
          key={item.grade}
          item={item}
          maxQuantity={maxQuantity}
          totalStudents={totalStudents}
        />
      ))}
    </div>
  );
};

export default DistributionList;

interface DistributionBarProps {
  item: ChartData;
  maxQuantity: number;
  totalStudents: number;
}

const DistributionBar: FC<DistributionBarProps> = ({
  item,
  maxQuantity,
  totalStudents,
}) => {
  const percentage =
    totalStudents > 0 ? (item.quantity / totalStudents) * 100 : 0;
  const barWidth = maxQuantity > 0 ? (item.quantity / maxQuantity) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "w-7 shrink-0 text-sm font-semibold tabular-nums",
          "text-foreground",
        )}
      >
        {item.grade}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted/50">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500",
            "ease-out",
          )}
          style={{ width: `${barWidth}%`, backgroundColor: item.fill }}
        />
      </div>
      <span
        className={cn(
          "w-10 shrink-0 text-right text-xs tabular-nums",
          "text-muted-foreground",
        )}
      >
        {item.quantity}
      </span>
      <span
        className={cn(
          "w-9 shrink-0 text-right text-sm font-semibold",
          "tabular-nums text-foreground",
        )}
      >
        {percentage.toFixed(0)}%
      </span>
    </div>
  );
};
