"use client";

import Translate from "@/common/components/translate/Translate";
import { normalizeCourse } from "@/app/courseNormalizer";
import CourseCard from "@/components/CourseCard";
import { Badge } from "@/components/ui/badge";
import { CourseRequirements } from "../../page";
import { FC } from "react";

interface CompulsoryCardSummaryProps {
  compulsoryCourses: CourseRequirements;
  selectedOccasions: Record<string, number>;
  onOccasionChange: (courseCode: string, index: number) => void;
}

const CompulsorySelector: FC<CompulsoryCardSummaryProps> = ({
  compulsoryCourses,
  selectedOccasions,
  onOccasionChange,
}) => {
  if (compulsoryCourses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Badge className="border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400">
            <Translate text="_guide_auto_added" />
          </Badge>
          <h2 className="text-xl font-semibold tracking-tight">
            <Translate text="_guide_required_courses" />
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          <Translate text="_guide_required_desc" />
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 items-stretch">
        {compulsoryCourses.map((req) =>
          req.courses.map((courseEntry) => (
            <div key={courseEntry.course.code}>
              <CourseCard
                variant="default"
                course={normalizeCourse(courseEntry.course)}
                selectedOccasionIndex={selectedOccasions[courseEntry.course.code] ?? 0}
                onOccasionChange={(idx) => onOccasionChange(courseEntry.course.code, idx)}
              />
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export default CompulsorySelector;
