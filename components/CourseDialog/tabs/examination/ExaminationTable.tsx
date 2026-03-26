"use client";

import ExaminationSectionHeader from "./components/ExaminationSectionHeader";
import { CourseExamination, CourseOccasion } from "@/app/dashboard/page";
import ExaminationTableHeader from "./components/ExaminationTableHeader";
import { useLatestOriginalStats } from "./hooks/useLatestOriginalStats";
import ExaminationTableRow from "./components/ExaminationTableRow";
import { useCourseData } from "../../hooks/useCourseData";
import { Table, TableBody } from "@/components/ui/table";
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
        <div className="rounded-md border">
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
