"use client";

import WorkloadChartLabel from "./components/WorkloadChartLabel";
import { useAnimationKey } from "@/common/hooks/useAnimationKey";
import { FC } from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const WORKLOAD_COLORS = {
  scheduled: "#26a96c",
  selfStudy: "#0c773e",
} as const;

const revenueChartConfig = {
  scheduled: {
    label: "Scheduled Hours",
    color: WORKLOAD_COLORS.scheduled,
  },
  selfStudy: {
    label: "Self-study Hours",
    color: WORKLOAD_COLORS.selfStudy,
  },
} satisfies ChartConfig;

interface WorkloadChartProps {
  scheduledHours: number;
  selfStudyHours: number;
}

const WorkloadChart: FC<WorkloadChartProps> = ({
  scheduledHours,
  selfStudyHours,
}) => {
  const animationKey = useAnimationKey({
    dependencies: [scheduledHours, selfStudyHours],
  });

  const data = [
    {
      name: "scheduled",
      hours: scheduledHours,
      fill: "var(--color-scheduled)",
    },
    {
      name: "selfStudy",
      hours: selfStudyHours,
      fill: "var(--color-selfStudy)",
    },
  ];

  return (
    // h-30/w-30 are --spacing multiples, but the pie's radii below are absolute
    // pixels. The landscape panel scale shrinks the box to 90px while the pie
    // still draws 100px across, which clipped it -- so landscape pins the box
    // to the 120px it resolves to everywhere else.
    <ChartContainer
      config={revenueChartConfig}
      className="h-30 w-30 landscape-phone:size-[7.5rem]"
    >
      <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          key={animationKey}
          data={data}
          dataKey="hours"
          nameKey="name"
          startAngle={90}
          endAngle={360 + 90}
          innerRadius={33}
          outerRadius={50}
          paddingAngle={data.find((item) => item.hours === 0) ? 0 : 4}
          cornerRadius={4}
          isAnimationActive
          animationBegin={80}
          animationDuration={520}
          animationEasing="ease-out"
        >
          <Label
            content={({ viewBox }) => (
              <WorkloadChartLabel
                viewBox={viewBox}
                totalHours={scheduledHours + selfStudyHours}
              />
            )}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};
export default WorkloadChart;
