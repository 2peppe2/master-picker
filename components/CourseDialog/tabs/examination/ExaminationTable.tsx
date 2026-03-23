"use client";

import { useLatestOriginalStats } from "./hooks/useLatestOriginalStats";
import { CourseExamination, CourseOccasion } from "@/app/dashboard/page";
import Translate from "@/common/components/translate/Translate";
import { useCourseData } from "../../hooks/useCourseData";
import { Scale } from "@/prisma/generated/client/enums";
import { NotebookText, BarChart2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Module } from "liu-tentor-package";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FC } from "react";

interface GradeCount {
  grade: string;
  quantity: number;
}

interface ExaminationTableProps {
  examination: CourseExamination[];
  courseCode: string;
  occasions: CourseOccasion[];
  onNavigateToStatistics: (modCode?: string) => void;
}

const ExaminationTable: FC<ExaminationTableProps> = ({
  examination,
  courseCode,
  occasions,
  onNavigateToStatistics,
}) => {
  const { data: courseData, isLoading } = useCourseData(courseCode);
  const getLatestStats = useLatestOriginalStats(courseData, occasions);

  return (
    <div className="space-y-3 text-foreground">
      <section>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
            <Translate text="_course_examinations" />
          </p>
          <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
            <NotebookText className="size-3.5" />
            {examination.length}{" "}
            {examination.length === 1 ? (
              <Translate text="_course_module_singular" />
            ) : (
              <Translate text="_course_module_plural" />
            )}
          </span>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <Translate text="_course_name" />
                </TableHead>
                <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <Translate text="_course_module" />
                </TableHead>
                <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <Translate text="_course_credits" />
                </TableHead>
                <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <Translate text="_course_scale" />
                </TableHead>
                <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <Translate text="_course_last_original_statistics" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examination.map((exam) => (
                <ExaminationTableRow
                  key={exam.module}
                  exam={exam}
                  getLatestStats={getLatestStats}
                  isLoading={isLoading}
                  onNavigateToStatistics={onNavigateToStatistics}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
};

export default ExaminationTable;

interface ExaminationTableRowProps {
  exam: CourseExamination;
  onNavigateToStatistics: (modCode?: string) => void;
  getLatestStats: (moduleCode: string) => Module | null;
  isLoading: boolean;
}

const ExaminationTableRow: FC<ExaminationTableRowProps> = ({
  exam,
  getLatestStats,
  isLoading,
  onNavigateToStatistics,
}) => {
  const stats = getLatestStats(exam.module);
  const getCount = (g: string) => {
    if (!stats) return 0;
    return stats.grades.find((x: GradeCount) => x.grade === g)?.quantity || 0;
  };

  return (
    <TableRow className="transition-colors hover:bg-muted/25">
      <TableCell>
        {exam.name.length <= 18
          ? exam.name
          : exam.name.substring(0, 18) + "..."}
      </TableCell>
      <TableCell>{exam.module}</TableCell>
      <TableCell>{exam.credits} ECTS</TableCell>
      <TableCell>
        {exam.scale == Scale.G_OR_U ? "U, G" : "U, 3, 4, 5"}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
        {isLoading ? (
          <div className="flex gap-2 items-center">
            <Skeleton className="h-3 w-10 rounded" />
            <Skeleton className="h-3 w-10 rounded" />
            {exam.scale !== Scale.G_OR_U && (
              <>
                <Skeleton className="h-3 w-10 rounded" />
                <Skeleton className="h-3 w-10 rounded" />
              </>
            )}
          </div>
        ) : stats ? (
          <div className="flex gap-2">
            {exam.scale == Scale.G_OR_U ? (
              <>
                <span title="Pass">
                  G:{" "}
                  {getCount("G") +
                    getCount("3") +
                    getCount("4") +
                    getCount("5")}
                </span>
                <span title="Fail">U: {getCount("U")}</span>
              </>
            ) : (
              <>
                <span title="Grade 5">5: {getCount("5")}</span>
                <span title="Grade 4">4: {getCount("4")}</span>
                <span title="Grade 3">3: {getCount("3")}</span>
                <span title="Fail">U: {getCount("U")}</span>
              </>
            )}
          </div>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
          onClick={() => onNavigateToStatistics?.(exam.module)}
        >
          <BarChart2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
