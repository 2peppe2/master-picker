"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { useIsPhone } from "@/common/hooks/useResponsiveLayout";
import { EvaluationTrendPoint } from "../types";
import { TrendingDown, TrendingUp } from "lucide-react";
import { FC, useLayoutEffect, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface EvaluationTrendChartProps {
  data: EvaluationTrendPoint[];
}

// Brand teal, matching the app accent used elsewhere (e.g. the disclaimer).
const TREND_COLOR = "rgb(0, 200, 179)";

const EvaluationTrendChart: FC<EvaluationTrendChartProps> = ({ data }) => {
  const translate = useCommonTranslate();
  const isPhone = useIsPhone();
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrame = 0;
    const measure = () => {
      const nextWidth = Math.floor(container.getBoundingClientRect().width);
      if (Number.isFinite(nextWidth) && nextWidth > 0) {
        setChartWidth((currentWidth) =>
          currentWidth === nextWidth ? currentWidth : nextWidth,
        );
      }
    };
    const scheduleMeasure = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(measure);
    };

    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(container);

    const tabPanel = container.closest('[role="tabpanel"]');
    const visibilityObserver = new MutationObserver(scheduleMeasure);
    if (tabPanel) {
      visibilityObserver.observe(tabPanel, {
        attributes: true,
        attributeFilter: ["class", "data-state", "hidden", "style"],
      });
    }

    window.addEventListener("resize", scheduleMeasure);
    measure();
    scheduleMeasure();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
    };
  }, []);

  const latest = data.at(-1)?.avgScore ?? null;
  const previous = data.at(-2)?.avgScore ?? null;
  const delta = latest !== null && previous !== null ? latest - previous : null;

  const chartHeight = isPhone ? 176 : 200;

  return (
    <div className="w-full min-w-0">
      <div className="flex items-end justify-between gap-3 px-3 pb-1 pt-1">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">
            {translate("_course_eval_avg_score")}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums text-foreground">
              {latest !== null ? latest.toFixed(2) : "–"}
            </span>
            <span className="text-sm text-muted-foreground">/ 5</span>
          </div>
        </div>
        {delta !== null && Math.abs(delta) >= 0.005 && (
          <TrendDelta delta={delta} />
        )}
      </div>

      <div
        ref={containerRef}
        className="h-44 w-full min-w-0 overflow-hidden sm:h-52"
      >
        {chartWidth > 0 && (
          <AreaChart
            key={chartWidth}
            width={chartWidth}
            height={chartHeight}
            data={data}
            margin={{ top: 8, right: 12, bottom: 4, left: isPhone ? -18 : -8 }}
          >
            <defs>
              <linearGradient id="evalTrendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={TREND_COLOR} stopOpacity={0.35} />
                <stop offset="100%" stopColor={TREND_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeOpacity={0.7}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              dy={8}
              interval="preserveStartEnd"
              minTickGap={isPhone ? 24 : 36}
              tick={{
                fontSize: isPhone ? 10 : 12,
                fill: "var(--muted-foreground)",
              }}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tickLine={false}
              axisLine={false}
              width={isPhone ? 32 : 44}
              tick={{
                fontSize: isPhone ? 10 : 12,
                fill: "var(--muted-foreground)",
              }}
            />
            <Tooltip
              cursor={{
                stroke: TREND_COLOR,
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                boxShadow: "0 8px 24px rgb(0 0 0 / 0.18)",
              }}
              labelStyle={{
                color: "var(--muted-foreground)",
                fontSize: "0.75rem",
                marginBottom: "0.125rem",
              }}
              itemStyle={{ color: "var(--foreground)", fontWeight: 600 }}
              formatter={(value) => [
                value,
                translate("_course_eval_avg_score"),
              ]}
            />
            <Area
              type="monotone"
              dataKey="avgScore"
              stroke={TREND_COLOR}
              strokeWidth={2.5}
              fill="url(#evalTrendFill)"
              dot={data.length === 1 ? { r: 4, fill: TREND_COLOR } : false}
              activeDot={{
                r: 4,
                fill: TREND_COLOR,
                stroke: "var(--card)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        )}
      </div>
    </div>
  );
};

interface TrendDeltaProps {
  delta: number;
}

const TrendDelta: FC<TrendDeltaProps> = ({ delta }) => {
  const positive = delta >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;

  return (
    <span
      className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold tabular-nums ${
        positive
          ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
          : "bg-red-500/12 text-red-600 dark:text-red-400"
      }`}
    >
      <Icon className="size-3.5" aria-hidden />
      {positive ? "+" : "−"}
      {Math.abs(delta).toFixed(2)}
    </span>
  );
};

export default EvaluationTrendChart;
