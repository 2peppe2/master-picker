"use client";

import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { normalizeCourse } from "@/app/courseNormalizer";
import type { CourseRequirements } from "../page";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/app/dashboard/page";
import { Check, X } from "lucide-react";
import { useState, FC, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";

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
  const t = useCommonTranslate();
  const [isOpen, setIsOpen] = useState(true);

  const NUM_TO_TYPED: Record<number, string> = useMemo(() => ({
    1: t("_num_one"),
    2: t("_num_two"),
    3: t("_num_three"),
    4: t("_num_four"),
  }), [t]);

  const minRequired = electiveCourses.minCount ?? 1;
  const isFulfilled = selection.length >= minRequired;

  return (
    <Card className="mt-8" key={`choice-group-${index}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-orange-500/10 dark:text-sky-400">
                {minRequired < 5
                  ? t("_guide_pick_count", { num: NUM_TO_TYPED[minRequired] })
                  : t("_guide_pick_count", { num: minRequired })}
              </Badge>
              <CardTitle>{t("_guide_elective_group", { index: index + 1 })}</CardTitle>
            </div>

            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
              {isFulfilled ? (
                <span className="text-emerald-600 dark:text-emerald-400">
                  {t("_guide_selected_count", { count: selection.length })}
                </span>
              ) : (
                <span>
                  {t("_guide_selected_of_count", { count: selection.length, min: minRequired })}
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
            {t("_guide_options_desc", { count: electiveCourses.courses.length, min: minRequired })}
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
