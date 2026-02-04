'use client'

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";
import { useEffect, useState } from "react";

const revenueChartConfig = {
    scheduled: {
        label: 'Scheduled Hours:',
        color: '#dbeafe'
    },
    selfStudy: {
        label: 'Self-study Hours:',
        color: '#bfdbfe'
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
        <ChartContainer config={revenueChartConfig} className="h-40 w-40">
            <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                    key={animationKey}
                    data={data}
                    dataKey="hours"
                    nameKey="name"
                    startAngle={90}
                    endAngle={360 + 90}
                    innerRadius={53}
                    outerRadius={75}
                    paddingAngle={3}
                    isAnimationActive
                    animationBegin={120}
                    animationDuration={700}
                    animationEasing="ease-out"
                >
                    <Label
                        content={({ viewBox }) => {
                            if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null
                            return (
                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                    <tspan className="fill-foreground text-base font-medium" x={viewBox.cx} y={viewBox.cy}>
                                        {totalHours} h
                                    </tspan>
                                    <tspan className="fill-muted-foreground text-xs" x={viewBox.cx} y={(viewBox.cy || 0) + 16}>
                                        Total Study Time
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
