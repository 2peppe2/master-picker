export interface NormalizedEvaluationReport {
  reportId: string;
  reportDate: string;
  scores: Record<string, number>;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const normalizeEvaluationReports = (
  reports: unknown,
): NormalizedEvaluationReport[] => {
  if (!Array.isArray(reports)) return [];

  return reports.flatMap((report) => {
    if (!isRecord(report)) return [];

    const reportId =
      typeof report.reportId === "string" || typeof report.reportId === "number"
        ? String(report.reportId).trim()
        : "";
    const reportDate =
      typeof report.reportDate === "string" ? report.reportDate : "";
    const parsedDate = new Date(reportDate);

    if (!reportId || Number.isNaN(parsedDate.getTime())) return [];

    const scores: Record<string, number> = {};
    if (isRecord(report.scores)) {
      for (const [score, rawCount] of Object.entries(report.scores)) {
        const scoreValue = Number(score);
        const count = Number(rawCount);

        if (
          Number.isFinite(scoreValue) &&
          scoreValue > 0 &&
          Number.isFinite(count) &&
          count >= 0
        ) {
          scores[score] = count;
        }
      }
    }

    return [
      {
        reportId,
        reportDate: parsedDate.toISOString(),
        scores,
      },
    ];
  });
};
