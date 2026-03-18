"use client";

import { CourseExamination } from "@/app/dashboard/page";
import { Scale } from "@/prisma/generated/client/enums";
import { NotebookText, BarChart2 } from "lucide-react";
import { useCourseData } from "./hooks/useCourseData";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FC } from "react";

interface ExaminationTableProps {
  examination: CourseExamination[];
  courseCode: string;
  onNavigateToStatistics?: (modCode?: string) => void;
}

const ExaminationTable: FC<ExaminationTableProps> = ({
  examination,
  courseCode,
  onNavigateToStatistics,
}) => {
  const { data: courseData } = useCourseData(courseCode);

  const getLatestStats = (moduleCode: string) => {
    if (!courseData?.modules) return null;
    const moduleExams = courseData.modules.filter(
      (m) => m.moduleCode === moduleCode,
    );
    if (!moduleExams.length) return null;
    return [...moduleExams].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )[0];
  };
  return (
    <div className="space-y-3 text-foreground">
      <section>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Examinations
          </p>
          <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
            <NotebookText className="size-3.5" />
            {examination.length} modules
          </span>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Scale</TableHead>
                <TableHead>Latest Stats</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examination.map((exam) => {
                const stats = getLatestStats(exam.module);
                const getCount = (g: string) => stats?.grades?.find((x: { grade: string; quantity: number }) => x.grade === g)?.quantity || 0;

                return (
                  <TableRow
                    key={exam.module}
                    className="transition-colors hover:bg-muted/25"
                  >
                    <TableCell>
                      {exam.name.length <= 25
                        ? exam.name
                        : exam.name.substring(0, 25) + "..."}
                    </TableCell>
                    <TableCell>{exam.module}</TableCell>
                    <TableCell>{exam.credits} ECTS</TableCell>
                    <TableCell>
                      {exam.scale == Scale.G_OR_U ? "U, G" : "U, 3, 4, 5"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {stats ? (
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
              })}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
};

export default ExaminationTable;
