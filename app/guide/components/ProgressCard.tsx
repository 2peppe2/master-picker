"use client";

import { Badge } from "@/components/ui/badge";
import { CourseRequirements } from "../page";
import { FC, useMemo } from "react";
import { cn } from "@/lib/utils";

import ContinueButton from "./ContinueButton";
import { Check } from "lucide-react";
import { Course } from "@/app/dashboard/page";

interface ProgressCardProps {
  compulsoryConfirmed: boolean;
  compulsoryCourses: CourseRequirements;
  electiveCourses: Record<number, Course | null>;
}

const ProgressCard: FC<ProgressCardProps> = ({
  compulsoryConfirmed,
  compulsoryCourses,
  electiveCourses,
}) => {
  const electedCourses = useMemo(
    () => Object.values(electiveCourses).filter((course) => course !== null),
    [electiveCourses],
  );
  const electiveCount = Object.keys(electiveCourses).length;
  const electiveConfirmed =
    electiveCount === 0 || electedCourses.length === electiveCount;
  const isComplete = compulsoryConfirmed && electiveConfirmed;
    console.log("ProgressCard render", { compulsoryConfirmed, electiveConfirmed, isComplete });

  return (
    <div className="fixed bottom-0 w-full bg-transparent z-20">
    <div className="mx-auto w-6xl mt-6 rounded-2xl border p-4 pb-8 bg-card m-4 shadow-2xl">
      <div className="flex w-full gap-8 justify-between items-center px-4">
        <div className="flex flex-col w-full">
          <div className="flex flex-col text-xs text-muted-foreground">
            <span>Selection progress</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${
                  electiveCount === 0
                    ? 100
                    : (electedCourses.length / electiveCount) * 100
                }%`,
              }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Badge
              variant="outline"
              className="rounded-full border-emerald-200 text-emerald-700"
            >
              {true ? "1. Confirm Required" : <Check className="h-4 w-4" />}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "rounded-full border px-3 py-1 font-medium",
                electiveConfirmed
                  ? "border-emerald-200 text-emerald-700"
                  : "border-sky-200 bg-sky-50 text-sky-700",
              )}
            >
              {true ? "2. Choose options" : <Check className="h-4 w-4" />}
            </Badge>
          </div>
        </div>
        
        <ContinueButton disabled= {!isComplete} />
      </div>
    </div>
    </div>
  );
};

export default ProgressCard;
