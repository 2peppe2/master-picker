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
import { useIsTouchLayout } from "@/common/hooks/useResponsiveLayout";
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
  const isTouchLayout = useIsTouchLayout();
  const { data: courseData, isLoading } = useCourseData(courseCode);
  const getLatestStats = useLatestOriginalStats({ courseData, occasions });

  return (
    <div className="space-y-3 text-foreground">
      <section>
        <ExaminationSectionHeader count={examination.length} />
        {/* Not `sm:` — a landscape phone is wide enough to pass a width check
            and would get the desktop table inside a very short dialog. */}
        <div
          className={cn(
            "space-y-2",
            // Two per row in landscape, matching the occasions list.
            "landscape-phone:grid landscape-phone:grid-cols-2",
            "landscape-phone:gap-2 landscape-phone:space-y-0",
            !isTouchLayout && "hidden",
          )}
        >
          {examination.length === 0 ? (
            <div
              className={cn(
                "rounded-2xl bg-muted/40 p-5 text-center text-sm",
                "text-muted-foreground landscape-phone:col-span-full",
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
        <div className={cn(isTouchLayout && "hidden")}>
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
