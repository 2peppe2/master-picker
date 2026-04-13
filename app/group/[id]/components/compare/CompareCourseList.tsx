"use client";

import type { CoursePreview } from "../../compareSchedules";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface CompareCourseListProps {
  courses: CoursePreview[];
  emptyLabel: string;
  tone?: "shared" | "muted";
}

const CompareCourseList: FC<CompareCourseListProps> = ({
  courses,
  emptyLabel,
  tone = "muted",
}) => {
  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-4">
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {courses.map((course) => (
        <div
          key={course.matchKey}
          className={cn(
            "rounded-2xl border px-3 py-2.5",
            tone === "shared"
              ? "border-emerald-500/25 bg-emerald-500/10"
              : "border-border/60 bg-background/70",
          )}
        >
          <p className="text-xs font-semibold tracking-wide text-foreground">
            {course.code}
          </p>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
            {course.name}
          </p>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {course.semesters.length > 0
              ? `Semester${course.semesters.length === 1 ? "" : "s"} ${course.semesters.join(", ")}`
              : ""}
            {course.periods.length > 0
              ? `${course.semesters.length > 0 ? " - " : ""}Period${course.periods.length === 1 ? "" : "s"} ${course.periods.join(", ")}`
              : ""}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CompareCourseList;
