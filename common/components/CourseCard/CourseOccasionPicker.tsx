"use client";

import Translate from "@/common/components/translate/Translate";
import { sortCourseOccasionsByPreferredSemesters } from "@/common/courseOccasionOrdering";
import type { Course, CourseOccasion } from "@/common/types";
import { useToRelativeSemester } from "@/common/hooks/useToRelativeSemester";
import { Button } from "@/components/ui/button";
import type { FC } from "react";

interface CourseOccasionPickerProps {
  course: Course;
  onSelect: (occasion: CourseOccasion) => void;
  preferredSemesters: number[];
  showAddButton?: boolean;
}

const CourseOccasionPicker: FC<CourseOccasionPickerProps> = ({
  course,
  onSelect,
  preferredSemesters,
  showAddButton = false,
}) => {
  const toRelativeSemester = useToRelativeSemester();
  const occasions = sortCourseOccasionsByPreferredSemesters({
    occasions: course.CourseOccasion,
    preferredSemesters,
    toRelativeSemester,
  });

  return (
    <div
      className={
        showAddButton
          ? "flex flex-col"
          : "flex max-h-[300px] flex-col gap-1 overflow-y-auto p-1"
      }
    >
      {occasions.map((occasion, index) => {
        const isMostRelevant = index === 0;
        const relativeSemester =
          toRelativeSemester({
            year: occasion.year,
            semester: occasion.semester,
          }) + 1;
        const periods = occasion.periods
          .map(({ period }) => period)
          .sort()
          .join(", ");
        const blocks = Array.from(
          new Set(occasion.periods.flatMap(({ blocks }) => blocks)),
        )
          .sort()
          .join(", ");

        if (!showAddButton) {
          return (
            <Button
              key={occasion.id}
              variant="ghost"
              className="h-auto w-full justify-start whitespace-normal border border-transparent px-3 py-3 hover:border-border hover:bg-accent"
              onClick={() => onSelect(occasion)}
            >
              <OccasionDetails
                relativeSemester={relativeSemester}
                periods={periods}
                blocks={blocks}
              />
            </Button>
          );
        }

        return (
          <div
            key={occasion.id}
            data-course-occasion-semester={relativeSemester}
            className={`flex min-h-16 items-center gap-4 py-4 ${
              isMostRelevant
                ? "-mx-5 bg-muted px-5"
                : index > 1
                  ? "border-t"
                  : ""
            }`}
          >
            <OccasionDetails
              relativeSemester={relativeSemester}
              periods={periods}
              blocks={blocks}
            />
            <Button
              type="button"
              size="sm"
              className="h-9 shrink-0 px-3"
              onClick={() => onSelect(occasion)}
            >
              <Translate text="_course_add_course" />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

interface OccasionDetailsProps {
  relativeSemester: number;
  periods: string;
  blocks: string;
}

const OccasionDetails: FC<OccasionDetailsProps> = ({
  relativeSemester,
  periods,
  blocks,
}) => (
  <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
    <span className="font-semibold text-foreground">
      <Translate text="_semester_label" args={{ s: relativeSemester }} />
    </span>
    <span className="text-xs text-muted-foreground">
      {periods ? `Period ${periods}` : "Unknown Period"} &bull;{" "}
      {blocks ? `Block ${blocks}` : "No Block"}
    </span>
  </div>
);

export default CourseOccasionPicker;
