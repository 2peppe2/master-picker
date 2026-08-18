"use client";

import DistributionBar from "./DistributionBar";

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
