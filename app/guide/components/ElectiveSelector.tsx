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
import { useState, FC } from "react";
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
  selection: Course | null;
  onSelectionChange: (course: Course) => void;
}

const ElectiveSelector: FC<ElectiveSelectorProps> = ({
  index,
  electiveCourses,
  selection,
  onSelectionChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="mt-8" key={`choice-group-${index}`}>
      <Collapsible
        open={isOpen}
        onOpenChange={(setOpen) => {
          setIsOpen(setOpen);
        }}
      >
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-sky-500/10 text-sky-700">Pick one</Badge>
              <CardTitle>Elective course {index + 1}</CardTitle>
            </div>

            <div
              className={
                "flex items-center gap-4 text-sm font-medium text-muted-foreground "
              }
            >
              {selection ? `Selected ${selection.code}` : "Select to continue"}

              <CollapsibleTrigger asChild>
                <Button
                  size="icon"
                  className={`cursor-pointer h-10 w-10 rounded-4xl ${isOpen ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700" : "bg-red-500/10 hover:bg-red-500/20 text-red-700"}`}
                  onClick={() => setIsOpen((open) => !open)}
                  disabled={!selection}
                >
                  {isOpen ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          <CardDescription>
            This group has {electiveCourses.courses.length} options, but you
            only need to select one.
          </CardDescription>
        </CardHeader>
        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <CardContent className="py-4">
            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {electiveCourses.courses.map((courseEntry) => {
                const course = normalizeCourse(courseEntry.course);
                const courseCode = course.code;
                const isSelected = selection?.code === courseCode;

                return (
                  <CourseCard
                    key={courseCode}
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
