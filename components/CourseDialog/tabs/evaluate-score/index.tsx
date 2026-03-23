"use client";

import { ChevronDown, Loader2, FileText, AlertCircle } from "lucide-react";
import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";
import Translate from "@/common/components/translate/Translate";
import { useCourseData } from "../../hooks/useCourseData";
import { useMemo, useState, FC } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EvaluateScoreProps {
  courseCode: string;
}

const EvaluateScore: FC<EvaluateScoreProps> = ({ courseCode }) => {
  const { data: courseData, isLoading, error } = useCourseData(courseCode);
  const [reportsOpen, setReportsOpen] = useState(false);
  const translate = useCommonTranslate();

  const trendData = useMemo(() => {
    if (!courseData?.evaluationReports?.length) return [];

    return [...courseData.evaluationReports]
      .sort(
        (a, b) =>
          new Date(a.reportDate).getTime() - new Date(b.reportDate).getTime(),
      )
      .map((report) => {
        let totalScoreSum = 0;
        let totalRespondents = 0;

        for (const [key, value] of Object.entries(report.scores)) {
          const count = Number(value);
          const scoreWeight = parseFloat(key);

          if (!isNaN(scoreWeight) && scoreWeight > 0) {
            totalScoreSum += scoreWeight * count;
            totalRespondents += count;
          }
        }

        const avgScore =
          totalRespondents > 0
            ? (totalScoreSum / totalRespondents).toFixed(2)
            : "0.00";

        return {
          date: new Date(report.reportDate).toLocaleDateString(undefined, {
            year: "2-digit",
            month: "short",
          }),
          avgScore: parseFloat(avgScore),
          reportId: report.reportId,
        };
      });
  }, [courseData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] h-full gap-4 text-muted-foreground w-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm font-medium">
          <Translate text="_course_eval_loading" />
        </p>
      </div>
    );
  }

  if (error || !courseData?.evaluationReports?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] h-full gap-4 text-muted-foreground w-full">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          {error ? (
            <AlertCircle className="h-6 w-6 opacity-50" />
          ) : (
            <FileText className="h-6 w-6 opacity-50" />
          )}
        </div>
        <p className="text-sm font-medium">
          {error ? (
            <Translate text="_course_eval_error" />
          ) : (
            <Translate text="_course_eval_none" />
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
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

      <div className="flex flex-col gap-2">
        <p className="text-[11px] leading-relaxed text-muted-foreground italic">
          <Translate text="_course_eval_data_via" />{" "}
          <a
            href="https://admin.evaliuate.liu.se/search"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            LiU Evaliuate
          </a>
          . <Translate text="_course_eval_desc" />
        </p>
      </div>

      <Collapsible open={reportsOpen} onOpenChange={setReportsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-xl border bg-card/50 hover:bg-accent transition-colors">
          <div className="flex flex-col items-start gap-0.5">
            <h3 className="text-sm font-semibold">
              <Translate text="_course_eval_archived_reports" /> (
              {courseData.evaluationReports.length})
            </h3>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              <Translate text="_course_eval_login_required" />
            </p>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
              reportsOpen ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-2">
          {[...courseData.evaluationReports]
            .sort(
              (a, b) =>
                new Date(b.reportDate).getTime() -
                new Date(a.reportDate).getTime(),
            )
            .map((report) => (
              <div
                key={report.reportId}
                className="flex items-center justify-between p-3 rounded-lg border bg-background"
              >
                <span className="text-sm font-medium">
                  {new Date(report.reportDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
                <a
                  href={`https://admin.evaliuate.liu.se/ReportFile/report/${report.reportId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <Translate text="_view_pdf" />
                </a>
              </div>
            ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default EvaluateScore;
