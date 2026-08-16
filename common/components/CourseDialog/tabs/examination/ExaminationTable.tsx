"use client";

import { cn } from "@/lib/utils";

import ExaminationSectionHeader from "./components/ExaminationSectionHeader";
import { CourseExamination, CourseOccasion } from "@/common/types";
import ExaminationTableHeader from "./components/ExaminationTableHeader";
import { useLatestOriginalStats } from "./hooks/useLatestOriginalStats";
import ExaminationTableRow from "./components/ExaminationTableRow";
import MobileExaminationCard from "./components/MobileExaminationCard";
import { useCourseData } from "../../hooks/useCourseData";
import { Table, TableBody } from "@/components/ui/table";
import Translate from "@/common/components/translate/Translate";
import { FC } from "react";

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
  const getLatestStats = useLatestOriginalStats({ courseData, occasions });

  return (
    <div className="space-y-3 text-foreground">
      <section>
        <ExaminationSectionHeader count={examination.length} />
        <div className="space-y-2 sm:hidden">
          {examination.length === 0 ? (
            <div
              className={cn(
                "rounded-2xl bg-muted/40 p-5 text-center text-sm",
                "text-muted-foreground",
              )}
            >
              <Translate text="_course_no_examinations" />
            </div>
          ) : (
            examination.map((exam) => (
              <MobileExaminationCard
                key={exam.module}
                exam={exam}
                stats={getLatestStats(exam.module)}
                isLoading={isLoading}
                onNavigateToStatistics={() =>
                  onNavigateToStatistics(exam.module)
                }
              />
            ))
          )}
        </div>
        <div className="hidden sm:block">
          <Table>
            <ExaminationTableHeader />
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
