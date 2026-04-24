"use client";

import Translate from "@/common/components/translate/Translate";
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
      <Translate text="distribution" />
    </Label>
    <div className="rounded-xl border bg-card/50 p-3 space-y-2">
      {chartData.map((item) => {
        const percentage =
          totalStudents > 0
            ? ((item.quantity / totalStudents) * 100).toFixed(1)
            : 0;

        return (
          <div key={item.grade} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-sm font-medium truncate">{item.grade}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] text-muted-foreground/70 hidden min-[400px]:inline">
                {item.quantity}
              </span>
              <span className="text-xs font-mono font-bold w-10 text-right tabular-nums">
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
