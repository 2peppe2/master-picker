'use client'

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";
import { useEffect, useState } from "react";

export const WORKLOAD_COLORS = {
    scheduled: "oklch(0.64 0.11 245)",
    selfStudy: "oklch(0.74 0.1 80)",
} as const;

const revenueChartConfig = {
    scheduled: {
        label: 'Scheduled Hours',
        color: WORKLOAD_COLORS.scheduled
    },
    selfStudy: {
        label: 'Self-study Hours',
        color: WORKLOAD_COLORS.selfStudy
    }
} satisfies ChartConfig

type DialogTimeChartProps = {
    scheduledHours: number;
    selfStudyHours: number;
};

const DialogTimeChart = ({ scheduledHours, selfStudyHours } : DialogTimeChartProps) => {
    const totalHours = scheduledHours + selfStudyHours;
    const data = [
        { name: 'scheduled', hours: scheduledHours, fill: 'var(--color-scheduled)' },
        { name: 'selfStudy', hours: selfStudyHours, fill: 'var(--color-selfStudy)' }
    ];
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setAnimationKey((prev) => prev + 1);
        });

        return () => cancelAnimationFrame(frame);
    }, [scheduledHours, selfStudyHours]);
    return (
        <ChartContainer config={revenueChartConfig} className="h-30 w-30">
            <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                    key={animationKey}
                    data={data}
                    dataKey="hours"
                    nameKey="name"
                    startAngle={90}
                    endAngle={360 + 90}
                    innerRadius={33}
                    outerRadius={50}
                    paddingAngle={data.find((item) => item.hours === 0) ? 0 : 2}
                    isAnimationActive
                    animationBegin={80}
                    animationDuration={520}
                    animationEasing="ease-out"
                >
                    <Label
                        content={({ viewBox }) => {
                            if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null
                            return (
                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                    <tspan className="fill-foreground text-sm font-medium" x={viewBox.cx} y={viewBox.cy}>
                                        {totalHours} h
                                    </tspan>
                                    <tspan className="fill-muted-foreground text-[10px]" x={viewBox.cx} y={(viewBox.cy || 0) + 13}>
                                        Total
                                    </tspan>
                                </text>
                            )
                        }}
                    />
                </Pie>
            </PieChart>
        </ChartContainer>
    );
}
export default DialogTimeChart;
