import Translate from "@/common/components/translate/Translate";
import type { NormalizedEvaluationReport } from "../normalizeEvaluationReports";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface ArchivedReportRowProps {
  report: NormalizedEvaluationReport;
}

const ArchivedReportRow: FC<ArchivedReportRowProps> = ({ report }) => (
  <div className={cn("flex min-h-12 items-center justify-between gap-3", "rounded-xl bg-muted/40 p-3")}>
    <span className="text-sm font-medium">
      {new Date(report.reportDate).toLocaleDateString(undefined, { year: "numeric", month: "long" })}
    </span>
    <a href={`https://admin.evaliuate.liu.se/ReportFile/report/${report.reportId}`} target="_blank" rel="noopener noreferrer" className={cn("shrink-0 rounded-full bg-primary/10 px-3 py-1.5", "text-xs font-bold text-primary transition-colors", "hover:bg-primary/20")}>
      <Translate text="_view_pdf" />
    </a>
  </div>
);

export default ArchivedReportRow;
