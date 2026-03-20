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
import type { Conflict } from "../GuideClientPage";
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
  conflicts: Conflict[];
  selectedOccasions: Record<string, number>;
  onOccasionChange: (code: string, index: number) => void;
}

const NUM_TO_TYPED: Record<number, string> = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
};

const ElectiveSelector: FC<ElectiveSelectorProps> = ({
  index,
  electiveCourses,
  selection,
  onSelectionChange,
  conflicts,
  selectedOccasions,
  onOccasionChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const normalizedCourses = useMemo(
    () => electiveCourses.courses.map((c) => normalizeCourse(c.course)),
    [electiveCourses.courses],
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
                {minRequired < 5
                  ? `Pick ${NUM_TO_TYPED[minRequired]}`
                  : `Pick ${minRequired}`}
              </Badge>
              <CardTitle>Elective Group {index + 1}</CardTitle>
            </div>

            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
              {isFulfilled ? (
                <span className="text-emerald-600 dark:text-emerald-400">
                  {selection.length} selected
                </span>
              ) : (
                <span>
                  {selection.length} of {minRequired} selected
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
            This group has {electiveCourses.courses.length} options. You need to
            select at least {minRequired}.
          </CardDescription>
        </CardHeader>

        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <CardContent className="py-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {normalizedCourses.map((course) => {
                const isSelected = selection.some(
                  (s) => s.code === course.code,
                );

                const courseConflicts = conflicts.filter(
                  (c) =>
                    c.courseA.code === course.code ||
                    c.courseB.code === course.code,
                );

                const isConflicting = courseConflicts.length > 0;
                const conflictingWith = courseConflicts.map((c) => ({
                  code:
                    c.courseA.code === course.code
                      ? c.courseB.code
                      : c.courseA.code,
                  semester: c.semester,
                  period: c.period,
                  block: c.block,
                }));

                return (
                  <CourseCard
                    key={course.code}
                    course={course}
                    variant="selectable"
                    isSelected={isSelected}
                    isConflicting={isConflicting}
                    conflictingWith={conflictingWith}
                    selectedOccasionIndex={selectedOccasions[course.code] ?? 0}
                    onOccasionChange={(idx) => onOccasionChange(course.code, idx)}
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
