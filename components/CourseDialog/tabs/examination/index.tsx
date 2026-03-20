"use client";

import WorkloadChart, { WORKLOAD_COLORS } from "./WorkloadChart";
import ExaminationTable from "./ExaminationTable";
import { BookOpen, Clock3 } from "lucide-react";
import { Course } from "@/app/dashboard/page";
import { FC } from "react";

interface ExaminationTabProps {
  course: Course;
  onNavigateToStatistics: (modCode?: string) => void;
}

const ExaminationTab: FC<ExaminationTabProps> = ({
  course,
  onNavigateToStatistics,
}) => {
  const totalHours = course.scheduledHours + course.selfStudyHours;
  const scheduledShare = totalHours
    ? Math.round((course.scheduledHours / totalHours) * 100)
    : 0;
  const selfStudyShare = totalHours ? 100 - scheduledShare : 0;

  return (
    <div className="space-y-3 py-2 text-foreground">
      <section className="rounded-md border p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide">
          Workload
        </p>
        <div className="grid items-center gap-3 sm:grid-cols-[auto_minmax(0,1fr)]">
          <WorkloadChart
            scheduledHours={course.scheduledHours}
            selfStudyHours={course.selfStudyHours}
          />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between py-1 text-xs">
              <span className="text-muted-foreground inline-flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="size-2 rounded-full"
                  style={{ backgroundColor: WORKLOAD_COLORS.scheduled }}
                />
                Scheduled
                <Clock3 aria-hidden className="size-2.5 opacity-70" />
              </span>
              <span className="font-medium text-foreground">
                {course.scheduledHours} h ({scheduledShare}%)
              </span>
            </div>
            <div className="flex items-center justify-between py-1 text-xs">
              <span className="text-muted-foreground inline-flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="size-2 rounded-full"
                  style={{ backgroundColor: WORKLOAD_COLORS.selfStudy }}
                />
                Self-study
                <BookOpen aria-hidden className="size-2.5 opacity-70" />
              </span>
              <span className="font-medium text-foreground">
                {course.selfStudyHours} h ({selfStudyShare}%)
              </span>
            </div>
          </div>
        </div>
      </section>
      <ExaminationTable
        courseCode={course.code}
        examination={course.Examination}
        occasions={course.CourseOccasion}
        onNavigateToStatistics={onNavigateToStatistics}
      />
    </div>
  );
};

export default ExaminationTab;
