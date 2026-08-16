"use client";

import EvaluationArchivedReports from "./components/EvaluationArchivedReports";
import EvaluationErrorBoundary from "./components/EvaluationErrorBoundary";
import EvaluationTrendChart from "./components/EvaluationTrendChart";
import EvaluationSourceLink from "./components/EvaluationSourceLink";
import EvaluateErrorState from "./components/EvaluateErrorState";
import { useEvaluationTrend } from "./hooks/useEvaluationTrend";
import { normalizeEvaluationReports } from "./normalizeEvaluationReports";
import EvaluateLoading from "./components/EvaluateLoading";
import { useCourseData } from "../../hooks/useCourseData";
import { FC, useMemo } from "react";

interface EvaluateScoreProps {
  courseCode: string;
}

const EvaluateScore: FC<EvaluateScoreProps> = ({ courseCode }) => {
  const { data: courseData, isLoading, error } = useCourseData(courseCode);
  const evaluationReports = useMemo(
    () => normalizeEvaluationReports(courseData?.evaluationReports),
    [courseData?.evaluationReports],
  );
  const trendData = useEvaluationTrend({
    evaluationReports,
  });

  if (isLoading) {
    return <EvaluateLoading />;
  }

  if (error || !evaluationReports.length) {
    return <EvaluateErrorState hasError={!!error} />;
  }

  return (
    <EvaluationErrorBoundary key={courseCode}>
      <div className="space-y-5 py-3 sm:space-y-6 sm:py-4">
        <EvaluationTrendChart data={trendData} />
        <EvaluationSourceLink />
        <EvaluationArchivedReports reports={evaluationReports} />
      </div>
    </EvaluationErrorBoundary>
  );
};

export default EvaluateScore;
