"use client";

import { EvaliuateData } from "liu-tentor-package";
import { EvaluationTrendPoint } from "../types";
import { useMemo } from "react";

export interface UseEvaluationTrendArgs {
  evaluationReports: EvaliuateData[] | undefined;
}

export const useEvaluationTrend = ({
  evaluationReports,
}: UseEvaluationTrendArgs): EvaluationTrendPoint[] => {
  return useMemo(() => {
    if (!evaluationReports?.length) return [];

    return [...evaluationReports]
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
  }, [evaluationReports]);
};
