"use client";

import { cn } from "@/lib/utils";

import Translate from "@/common/components/translate/Translate";
import type { NormalizedEvaluationReport } from "../normalizeEvaluationReports";
import { ChevronDown } from "lucide-react";
import { FC, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface EvaluationArchivedReportsProps {
  reports: NormalizedEvaluationReport[];
}

const EvaluationArchivedReports: FC<EvaluationArchivedReportsProps> = ({
  reports,
}) => {
  const [reportsOpen, setReportsOpen] = useState(false);

  return (
    <Collapsible open={reportsOpen} onOpenChange={setReportsOpen}>
      <CollapsibleTrigger
        className={cn(
          "flex min-h-14 w-full cursor-pointer items-center",
          "justify-between rounded-2xl bg-muted/40 p-4",
          "text-left transition-colors hover:bg-muted/70 sm:p-3",
        )}
      >
        <div className="flex flex-col items-start gap-0.5">
          <h3 className="text-sm font-semibold">
            <Translate text="_course_eval_archived_reports" /> ({reports.length}
            )
          </h3>
          <p className="text-2xs text-muted-foreground">
            <Translate text="_course_eval_login_required" />
          </p>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            reportsOpen ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2">
        {[...reports]
          .sort(
            (a, b) =>
              new Date(b.reportDate).getTime() -
              new Date(a.reportDate).getTime(),
          )
          .map((report) => (
            <ArchivedReportRow key={report.reportId} report={report} />
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default EvaluationArchivedReports;

interface ArchivedReportRowProps {
  report: NormalizedEvaluationReport;
}

const ArchivedReportRow: FC<ArchivedReportRowProps> = ({ report }) => (
  <div
    className={cn(
      "flex min-h-12 items-center justify-between gap-3",
      "rounded-xl bg-muted/40 p-3",
    )}
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
      className={cn(
        "shrink-0 rounded-full bg-primary/10 px-3 py-1.5",
        "text-xs font-bold text-primary transition-colors",
        "hover:bg-primary/20",
      )}
    >
      <Translate text="_view_pdf" />
    </a>
  </div>
);
