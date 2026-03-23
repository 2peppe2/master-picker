"use client";

import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";
import { EvaluationTrendPoint } from "../types";
import { FC } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface EvaluationTrendChartProps {
  data: EvaluationTrendPoint[];
}

const EvaluationTrendChart: FC<EvaluationTrendChartProps> = ({ data }) => {
  const translate = useCommonTranslate();

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            domain={[1, 5]}
            tick={{ fontSize: 12 }}
            label={{
              value: translate("_course_eval_avg_score"),
              angle: -90,
              position: "center",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
            }}
            formatter={(value) => {
              if (typeof value === "number") {
                return [value, translate("_course_eval_avg_score")];
              }
              return value;
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Line
            type="monotone"
            dataKey="avgScore"
            stroke="hsl(142, 76%, 36%)"
            strokeWidth={3}
            dot={{ r: 4, fill: "hsl(142, 76%, 36%)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EvaluationTrendChart;
