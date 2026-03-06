"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { type CourseData, fetchCourseData } from "./courseDataCache";

type EvaluateScoreProps = {
  courseCode: string;
};

const EvaluateScore = ({ courseCode }: EvaluateScoreProps) => {
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportsOpen, setReportsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchCourseData(courseCode);
        setCourseData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseCode]);

  const getTrendData = () => {
    if (!courseData || !courseData.evaluationReports || courseData.evaluationReports.length === 0) {
      return [];
    }

    return courseData.evaluationReports
      .sort((a, b) => new Date(a.reportDate).getTime() - new Date(b.reportDate).getTime())
      .map((report) => {
        let averageScore = 0;
        let totalWeight = 0;

        for (const key in report.scores) {
            const scoreAmount = report.scores[key];
            const scoreValue = parseFloat(key);
            
            if (!isNaN(scoreValue) && scoreValue >= 0) {
                averageScore += scoreValue * scoreAmount;
                totalWeight += scoreAmount;
            }
        }

        const avgScore = totalWeight > 0 ? (averageScore / totalWeight).toFixed(2) : "0.00";

        return {
          date: new Date(report.reportDate).toLocaleDateString(),
          avgScore: parseFloat(avgScore),
          reportId: report.reportId,
        };
      });
  };

  const trendData = getTrendData();

  if (isLoading || error || (!courseData || !courseData.evaluationReports || courseData.evaluationReports.length === 0)) {
    return (
      <div className="flex items-center justify-center py-8">
        {isLoading ? (
          <p className="text-muted-foreground">Loading evaluation data...</p>
        ) : error ? (
          <p className="text-destructive">Error: {error}</p>
        ) : (
          <p className="text-muted-foreground">No evaluation data available</p>
        )}
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
              label={{ value: "Average Score", angle: -90, position: "center" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
              formatter={(value) => {
                if (typeof value === "number") {
                  return [value, "Average Score"];
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
              dot={{ r: 4, fill: "hsl(142, 76%, 36%)" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
            Course evaluation data is provided by{" "}
            <a href="https://admin.evaliuate.liu.se/search?lang=sv" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Liu Evaliuate</a> (Liu login required).
                Calculated from the course&apos;s overall evaluation
        </p>
      </div>


      <Collapsible open={reportsOpen} onOpenChange={setReportsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md border hover:bg-accent">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-left">Reports ({courseData.evaluationReports.length})</h3>
            <p className="text-xs text-muted-foreground">Liu login required</p>
          </div>
          <ChevronDown 
            className="h-4 w-4 transition-transform duration-200" 
            style={{ transform: reportsOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-2">
          {courseData && courseData.evaluationReports && courseData.evaluationReports
            .sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime())
            .map((report) => (
              <div key={report.reportId} className="flex items-center justify-between p-2 rounded-md border">
                <span className="text-sm">{new Date(report.reportDate).toLocaleDateString()}</span>
                <a
                  href={`https://admin.evaliuate.liu.se/ReportFile/report/${report.reportId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View Report
                </a>
              </div>
            ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default EvaluateScore;
