"use client";

import Translate from "@/common/components/translate/Translate";
import { EvaliuateData } from "liu-tentor-package";
import { ChevronDown } from "lucide-react";
import { FC, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface EvaluationArchivedReportsProps {
  reports: EvaliuateData[];
}

const EvaluationArchivedReports: FC<EvaluationArchivedReportsProps> = ({
  reports,
}) => {
  const [reportsOpen, setReportsOpen] = useState(false);

  return (
    <Collapsible open={reportsOpen} onOpenChange={setReportsOpen}>
      <CollapsibleTrigger className="cursor-pointer flex items-center justify-between w-full p-3 rounded-xl border bg-card/50 hover:bg-accent transition-colors text-left">
        <div className="flex flex-col items-start gap-0.5">
          <h3 className="text-sm font-semibold">
            <Translate text="_course_eval_archived_reports" /> ({reports.length}
            )
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
      <CollapsibleContent className="mt-2 space-y-2">
        {[...reports]
          .sort(
            (a, b) =>
              new Date(b.reportDate).getTime() -
              new Date(a.reportDate).getTime(),
          )
          .map((report) => (
            <div
              key={report.reportId}
              className="flex items-center justify-between rounded-lg border bg-background p-3"
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
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
              >
                <Translate text="_view_pdf" />
              </a>
            </div>
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default EvaluationArchivedReports;
