"use client";

import { Label } from "@/components/ui/label";
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
}) => (
  <div className="space-y-3">
    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
      Distribution
    </Label>
    <div className="rounded-xl border bg-card/50 p-4 space-y-3">
      {chartData.map((item) => {
        const percentage =
          totalStudents > 0
            ? ((item.quantity / totalStudents) * 100).toFixed(1)
            : 0;

        return (
          <div key={item.grade} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-sm font-medium">Grade {item.grade}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                {item.quantity} students
              </span>
              <span className="text-sm font-mono font-bold w-12 text-right tabular-nums">
                {percentage}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default DistributionList;
