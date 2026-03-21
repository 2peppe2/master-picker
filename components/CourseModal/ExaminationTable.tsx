"use client";

import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CourseExamination } from "@/app/dashboard/page";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartNoAxesColumn } from "lucide-react";
import { FC } from "react";

interface ExaminationTableProps {
  courseCode: string;
  examination: CourseExamination[];
  onNavigateToStatistics?: (moduleCode?: string) => void;
}

const ExaminationTable: FC<ExaminationTableProps> = ({
  examination,
  onNavigateToStatistics,
}) => {
  const t = useCommonTranslate();

  return (
    <section className="rounded-md border p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide">
        {t("_course_examinations")}
      </p>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-muted/30">
              <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {t("_course_name")}
              </TableHead>
              <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {t("_course_module")}
              </TableHead>
              <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {t("_course_credits")}
              </TableHead>
              <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {t("_course_scale")}
              </TableHead>
              <TableHead className="text-right py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {t("_course_latest_stats")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {examination.map((exam) => (
              <TableRow
                key={exam.module}
                className="group border-border/50 transition-colors hover:bg-muted/30"
              >
                <TableCell className="py-2 text-xs font-medium text-foreground">
                  {exam.name}
                </TableCell>
                <TableCell className="py-2 text-[11px] text-muted-foreground">
                  {exam.module}
                </TableCell>
                <TableCell className="py-2">
                  <Badge
                    variant="secondary"
                    className="rounded-md px-1.5 py-0 text-[10px] font-medium"
                  >
                    {exam.credits} HP
                  </Badge>
                </TableCell>
                <TableCell className="py-2 text-[11px] text-muted-foreground">
                  {exam.scale}
                </TableCell>
                <TableCell className="text-right py-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 transition-all group-hover:bg-accent group-hover:text-accent-foreground"
                    onClick={() => onNavigateToStatistics?.(exam.module)}
                    title={t("_course_tab_statistics")}
                  >
                    <ChartNoAxesColumn className="size-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default ExaminationTable;
