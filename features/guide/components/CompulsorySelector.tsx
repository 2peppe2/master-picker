"use client";

import Translate from "@/common/components/translate/Translate";
import { normalizeCourse } from "@/common/courseNormalizer";
import CourseCard from "@/common/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CourseRequirements } from "@/features/guide/types";
import { Check, ChevronDown, X } from "lucide-react";
import { FC, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CompulsoryCardSummaryProps {
  compulsoryCourses: CourseRequirements;
}

const CompulsorySelector: FC<CompulsoryCardSummaryProps> = ({
  compulsoryCourses,
}) => {
  const [isRequiredOpen, setRequiredOpen] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (compulsoryCourses.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8 gap-4 sm:mt-10">
      <Collapsible
        open={isRequiredOpen}
        onOpenChange={(setOpen) => {
          setRequiredOpen(setOpen);
        }}
      >
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400">
                <Translate text="_guide_auto_added" />
              </Badge>
              <CardTitle>
                <Translate text="_guide_required_courses" />
              </CardTitle>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                aria-label={
                  isConfirmed
                    ? "Mark required courses as not confirmed"
                    : "Confirm required courses"
                }
                className={`size-11 rounded-full ${
                  isConfirmed
                    ? "bg-red-500/10 text-red-700 hover:bg-red-500/20"
                    : "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20"
                }`}
                onClick={() => {
                  const next = !isConfirmed;
                  setIsConfirmed(next);
                }}
              >
                {isConfirmed ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
              <CollapsibleTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={
                    isRequiredOpen
                      ? "Collapse required courses"
                      : "Expand required courses"
                  }
                  className="size-11 rounded-full"
                >
                  <ChevronDown
                    className={`size-4 transition-transform ${
                      isRequiredOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          <CardDescription>
            <Translate text="_guide_required_desc" />
          </CardDescription>
        </CardHeader>
        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <CardContent>
            <div className="grid grid-cols-2 justify-items-center gap-4 py-4 sm:grid-cols-3 lg:grid-cols-4">
              {compulsoryCourses.map((req) =>
                req.courses.map((courseEntry) => (
                  <div
                    key={courseEntry.course.code}
                    className="flex w-full justify-center"
                  >
                    <CourseCard
                      variant="default"
                      course={normalizeCourse(courseEntry.course)}
                    />
                  </div>
                )),
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default CompulsorySelector;
