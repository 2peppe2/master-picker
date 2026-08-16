"use client";

import Translate from "@/common/components/translate/Translate";
import type { Course } from "@/common/types";
import { Badge } from "@/components/ui/badge";
import {
  CalendarClock,
  CircleStar,
  GraduationCap,
  NotebookText,
} from "lucide-react";
import type { FC } from "react";

interface CourseMetadataProps {
  course: Course;
  compact?: boolean;
  summaryOnly?: boolean;
}

const CourseMetadata: FC<CourseMetadataProps> = ({
  course,
  compact = false,
  summaryOnly = false,
}) => {
  const level = course.level.trim() || "N/A";
  const isCompact = compact || summaryOnly;
  const badgeClass = isCompact
    ? "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px]"
    : "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs";
  const iconClass = isCompact ? "size-3" : "size-3.5";

  return (
    <div
      className={`flex flex-wrap items-center ${
        isCompact ? "gap-1.5 pt-2" : "gap-2 pt-3"
      }`}
    >
      <Badge variant="secondary" className={`${badgeClass} font-semibold`}>
        <GraduationCap className={iconClass} />
        {course.credits} HP
      </Badge>
      <Badge variant="outline" className={badgeClass}>
        <CircleStar className={iconClass} />
        <Translate text="_course_level" /> {level}
      </Badge>
      {!summaryOnly && (
        <>
          <Badge variant="outline" className={badgeClass}>
            <NotebookText className={iconClass} />
            {course.Examination.length}{" "}
            <Translate
              text={
                course.Examination.length > 1
                  ? "_course_module_plural"
                  : "_course_module_singular"
              }
            />
          </Badge>
          <Badge variant="outline" className={badgeClass}>
            <CalendarClock className={iconClass} />
            {course.CourseOccasion.length}{" "}
            <Translate
              text={
                course.CourseOccasion.length > 1
                  ? "_course_occasion_plural"
                  : "_course_occasion_singular"
              }
            />
          </Badge>
        </>
      )}
    </div>
  );
};

export default CourseMetadata;
