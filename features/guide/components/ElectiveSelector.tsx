"use client";

import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import Translate from "@/common/components/translate/Translate";
import { normalizeCourse } from "@/common/courseNormalizer";
import type { CourseRequirements } from "@/features/guide/types";
import CourseCard from "@/common/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/common/types";
import { useState, FC, memo, useMemo } from "react";
import { Check, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ElectiveSelectorProps {
  index: number;
  electiveCourses: CourseRequirements[0];
  selectedCourseIds: string[];
  onSelectionChange: (index: number, selection: string[]) => void;
}

const ElectiveSelectorComponent: FC<ElectiveSelectorProps> = ({
  index,
  electiveCourses,
  selectedCourseIds,
  onSelectionChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const translate = useCommonTranslate();

  const NUM_TO_TYPED: Record<number, string> = useMemo(
    () => ({
      1: translate("num_one"),
      2: translate("num_two"),
      3: translate("num_three"),
      4: translate("num_four"),
      5: translate("num_five"),
      6: translate("num_six"),
      7: translate("num_seven"),
      8: translate("num_eight"),
      9: translate("num_nine"),
      10: translate("num_ten"),
      11: translate("num_eleven"),
      12: translate("num_twelve"),
    }),
    [translate],
  );

  const minRequired = electiveCourses.minCount ?? 1;
  const isFulfilled = selectedCourseIds.length >= minRequired;

  const handleSelectionChange = (course: Course) => {
    const next = selectedCourseIds.includes(course.code)
      ? selectedCourseIds.filter((code) => code !== course.code)
      : [...selectedCourseIds, course.code];
    onSelectionChange(index, next);
  };

  return (
    <Card className="mt-6 gap-4 sm:mt-8 landscape-phone:mt-3" key={`choice-group-${index}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400">
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
              <CardTitle>
                <Translate
                  text="_guide_elective_group"
                  args={{ index: index + 1 }}
                />
              </CardTitle>
            </div>

            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
              {isFulfilled ? (
                <span className="text-emerald-600 dark:text-emerald-400">
                  <Translate
                    text="_guide_selected_of_count"
                    args={{ count: selectedCourseIds.length, min: minRequired }}
                  />
                </span>
              ) : (
                <span>
                  <Translate
                    text="_guide_selected_of_count"
                    args={{ count: selectedCourseIds.length, min: minRequired }}
                  />
                </span>
              )}

              <CollapsibleTrigger asChild>
                <Button
                  size="icon"
                  className={`size-11 rounded-full transition-colors ${
                    !isOpen
                      ? "bg-red-500/10 hover:bg-red-500/20 text-red-700"
                      : isFulfilled
                        ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700"
                        : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-700"
                  }`}
                  disabled={!isFulfilled && isOpen}
                >
                  {!isOpen ? (
                    <X className="h-4 w-4" />
                  ) : isFulfilled ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          <CardDescription>
            <Translate
              text="_guide_options_desc"
              args={{
                count: electiveCourses.courses.length,
                min: minRequired,
              }}
            />
          </CardDescription>
        </CardHeader>

        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <CardContent className="py-4">
            <div className="grid grid-cols-2 justify-items-center gap-4 sm:grid-cols-3 lg:grid-cols-4 landscape-phone:grid-cols-5 landscape-phone:gap-2">
              {electiveCourses.courses.map((courseEntry) => {
                const course = normalizeCourse(courseEntry.course);
                const isSelected = selectedCourseIds.includes(course.code);

                return (
                  <CourseCard
                    key={course.code}
                    course={course}
                    variant="selectable"
                    isSelected={isSelected}
                    onSelectionChange={handleSelectionChange}
                  />
                );
              })}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

const ElectiveSelector = memo(ElectiveSelectorComponent);
ElectiveSelector.displayName = "ElectiveSelector";

export default ElectiveSelector;
