"use client";

import { cn } from "@/lib/utils";

import WorkloadChart, { WORKLOAD_COLORS } from "./WorkloadChart";
import Translate from "@/common/components/translate/Translate";
import ExaminationTable from "./ExaminationTable";
import { BookOpen, Clock3 } from "lucide-react";
import { Course } from "@/common/types";
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
    <div className="space-y-4 py-3 text-foreground">
      <section>
        <p className="mb-3 text-sm font-medium text-foreground landscape-phone:mb-2">
          <Translate text="course_workload" />
        </p>
        <div
          className={cn(
            "grid grid-cols-1 items-center gap-3",
            "min-[360px]:grid-cols-[auto_minmax(0,1fr)]",
          )}
        >
          <div className="flex justify-center">
            <WorkloadChart
              scheduledHours={course.scheduledHours}
              selfStudyHours={course.selfStudyHours}
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between py-1 text-xs">
              <span
                className={cn(
                  "text-muted-foreground inline-flex items-center",
                  "gap-1.5",
                )}
              >
                <span
                  aria-hidden
                  className="size-2 rounded-full"
                  style={{ backgroundColor: WORKLOAD_COLORS.scheduled }}
                />
                <Translate text="course_scheduled" />
                <Clock3 aria-hidden className="size-2.5 opacity-70" />
              </span>
              <span className="font-medium text-foreground">
                {course.scheduledHours} h ({scheduledShare}%)
              </span>
            </div>
            <div className="flex items-center justify-between py-1 text-xs">
              <span
                className={cn(
                  "text-muted-foreground inline-flex items-center",
                  "gap-1.5",
                )}
              >
                <span
                  aria-hidden
                  className="size-2 rounded-full"
                  style={{ backgroundColor: WORKLOAD_COLORS.selfStudy }}
                />
                <Translate text="course_self_study" />
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
