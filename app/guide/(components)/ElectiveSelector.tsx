"use client";

import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import Translate from "@/common/components/translate/Translate";
import { normalizeCourse } from "@/app/courseNormalizer";
import type { CourseRequirements } from "../page";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/app/dashboard/page";
import { useState, FC, useMemo } from "react";
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
  selection: Course[];
  onSelectionChange: (course: Course) => void;
}

const ElectiveSelector: FC<ElectiveSelectorProps> = ({
  index,
  electiveCourses,
  selection,
  onSelectionChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);
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
    <Card className="mt-8" key={`choice-group-${index}`}>
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
                    args={{ count: selection.length, min: minRequired }}
                  />
                </span>
              ) : (
                <span>
                  <Translate
                    text="_guide_selected_of_count"
                    args={{ count: selection.length, min: minRequired }}
                  />
                </span>
              )}

              <CollapsibleTrigger asChild>
                <Button
                  size="icon"
                  className={`cursor-pointer h-10 w-10 rounded-full transition-colors ${
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {electiveCourses.courses.map((courseEntry) => {
                const course = normalizeCourse(courseEntry.course);
                const isSelected = selection.some(
                  (s) => s.code === course.code,
                );

                return (
                  <CourseCard
                    key={course.code}
                    course={course}
                    variant="selectable"
                    isSelected={isSelected}
                    onSelectionChange={onSelectionChange}
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

export default ElectiveSelector;
