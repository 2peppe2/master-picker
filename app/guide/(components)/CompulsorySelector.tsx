"use client";

import Translate from "@/common/components/translate/Translate";
import { normalizeCourse } from "@/app/courseNormalizer";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseRequirements } from "../page";
import { Check, X } from "lucide-react";
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
  compulsoryConfirmed: boolean;
  onConfirmChange: () => void;
}

const CompulsorySelector: FC<CompulsoryCardSummaryProps> = ({
  compulsoryCourses,
  compulsoryConfirmed,
  onConfirmChange,
}) => {
  const [isRequiredOpen, setRequiredOpen] = useState(true);

  if (compulsoryCourses.length === 0) {
    return null;
  }

  return (
    <Card className="mt-10">
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

            <CollapsibleTrigger asChild>
              <Button
                size="icon"
                className={`cursor-pointer h-10 w-10 rounded-4xl ${compulsoryConfirmed ? "bg-red-500/10 hover:bg-red-500/20 text-red-700" : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700"}`}
                onClick={onConfirmChange}
              >
                {compulsoryConfirmed ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CardDescription>
            <Translate text="_guide_required_desc" />
          </CardDescription>
        </CardHeader>
        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 py-4">
              {compulsoryCourses.map((req) =>
                req.courses.map((courseEntry) => (
                  <div key={courseEntry.course.code} className="space-y-3">
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
