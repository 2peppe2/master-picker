"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import Translate from "@/common/components/translate/Translate";
import { normalizeCourse } from "@/app/courseNormalizer";
import type { CourseRequirements } from "../../page";
import CourseCard from "@/components/CourseCard";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/app/dashboard/page";
import { FC, useMemo } from "react";

interface ElectiveSelectorProps {
  index: number;
  electiveCourses: CourseRequirements[0];
  selection: Course[];
  selectedOccasions: Record<string, number>;
  onSelectionChange: (course: Course) => void;
  onOccasionChange: (courseCode: string, index: number) => void;
}

const ElectiveSelector: FC<ElectiveSelectorProps> = ({
  index,
  electiveCourses,
  selection,
  selectedOccasions,
  onSelectionChange,
  onOccasionChange,
}) => {
  const translate = useCommonTranslate();

  const NUM_TO_TYPED: Record<number, string> = useMemo(
    () => ({
      1: translate("_num_one"),
      2: translate("_num_two"),
      3: translate("_num_three"),
      4: translate("_num_four"),
      5: translate("_num_five"),
      6: translate("_num_six"),
      7: translate("_num_seven"),
      8: translate("_num_eight"),
      9: translate("_num_nine"),
      10: translate("_num_ten"),
      11: translate("_num_eleven"),
      12: translate("_num_twelve"),
    }),
    [translate],
  );

  const minRequired = electiveCourses.minCount ?? 1;
  const isFulfilled = selection.length >= minRequired;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Badge className="border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400 font-bold tracking-wide">
              {minRequired < 12 ? (
                <Translate
                  text="_guide_pick_count"
                  args={{ num: NUM_TO_TYPED[minRequired] }}
                />
              ) : (
                <Translate
                  text="_guide_pick_count"
                  args={{ num: minRequired }}
                />
              )}
            </Badge>
            <h2 className="text-xl font-semibold tracking-tight">
              <Translate
                text="_guide_elective_group"
                args={{ index: index + 1 }}
              />
            </h2>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            {isFulfilled ? (
              <span className="text-emerald-600 dark:text-emerald-400">
                <Translate
                  text="_guide_selected_of_count"
                  args={{ count: selection.length, min: minRequired }}
                />
              </span>
            ) : (
              <span className="text-muted-foreground/60">
                <Translate
                  text="_guide_selected_of_count"
                  args={{ count: selection.length, min: minRequired }}
                />
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground/80">
          <Translate
            text="_guide_options_desc"
            args={{
              count: electiveCourses.courses.length,
              min: minRequired,
            }}
          />
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 items-stretch">
        {electiveCourses.courses.map((courseEntry) => {
          const course = normalizeCourse(courseEntry.course);
          const isSelected = selection.some(
            (s) => s.code === course.code,
          );

          return (
            <div key={course.code}>
              <CourseCard
                course={course}
                variant="selectable"
                isSelected={isSelected}
                selectedOccasionIndex={selectedOccasions[course.code] ?? 0}
                onSelectionChange={onSelectionChange}
                onOccasionChange={(idx) => onOccasionChange(course.code, idx)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ElectiveSelector;
