"use client";

import { EvaluationTrendPoint } from "../types";
import type { NormalizedEvaluationReport } from "../normalizeEvaluationReports";
import { useMemo } from "react";

export interface UseEvaluationTrendArgs {
  evaluationReports: NormalizedEvaluationReport[];
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
      .flatMap((report) => {
        let totalScoreSum = 0;
        let totalRespondents = 0;

        for (const [key, value] of Object.entries(report.scores)) {
          const scoreWeight = Number(key);

          if (Number.isFinite(scoreWeight) && scoreWeight > 0) {
            totalScoreSum += scoreWeight * value;
            totalRespondents += value;
          }
        }

        if (totalRespondents <= 0) return [];

        const avgScore = totalScoreSum / totalRespondents;
        if (!Number.isFinite(avgScore)) return [];

        return [
          {
            date: new Date(report.reportDate).toLocaleDateString(undefined, {
              year: "2-digit",
              month: "short",
            }),
            avgScore: Number(avgScore.toFixed(2)),
            reportId: report.reportId,
          },
        ];
      });
  }, [evaluationReports]);
};
