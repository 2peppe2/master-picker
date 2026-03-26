"use client";

import EvaluationArchivedReports from "./components/EvaluationArchivedReports";
import EvaluationTrendChart from "./components/EvaluationTrendChart";
import EvaluationSourceLink from "./components/EvaluationSourceLink";
import EvaluateErrorState from "./components/EvaluateErrorState";
import { useEvaluationTrend } from "./hooks/useEvaluationTrend";
import EvaluateLoading from "./components/EvaluateLoading";
import { useCourseData } from "../../hooks/useCourseData";
import { FC } from "react";

interface EvaluateScoreProps {
  courseCode: string;
}

const EvaluateScore: FC<EvaluateScoreProps> = ({ courseCode }) => {
  const { data: courseData, isLoading, error } = useCourseData(courseCode);
  const trendData = useEvaluationTrend({
    evaluationReports: courseData?.evaluationReports,
  });

  if (isLoading) {
    return <EvaluateLoading />;
  }

  if (error || !courseData?.evaluationReports?.length) {
    return <EvaluateErrorState hasError={!!error} />;
  }

  return (
    <div className="space-y-6 py-4">
      <EvaluationTrendChart data={trendData} />
      <EvaluationSourceLink />
      <EvaluationArchivedReports reports={courseData.evaluationReports} />
    </div>
  );
};

export default EvaluateScore;
