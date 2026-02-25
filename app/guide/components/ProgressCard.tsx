"use client";

import { Badge } from "@/components/ui/badge";
import ContinueButton from "./ContinueButton";
import { Course } from "@/app/dashboard/page";
import { CourseRequirements } from "../page";
import { Check } from "lucide-react";
import { FC, useMemo } from "react";
import { cn } from "@/lib/utils";

interface ProgressStep {
  states: {
    active: {
      label: string;
      style: string;
    };
    default: {
      label: string;
      style: string;
    };
  };
  isDone: boolean;
}

interface ProgressCardProps {
  compulsoryConfirmed: boolean;
  compulsoryCourses: CourseRequirements;
  bachelorCourses: Course[];
  electiveCourses: Record<number, Course[]>;
}

const ProgressCard: FC<ProgressCardProps> = ({
  compulsoryConfirmed,
  bachelorCourses,
  compulsoryCourses,
  electiveCourses,
}) => {
  const { electiveConfirmed, progressPercent, isComplete } = useMemo(() => {
    const electedList = Object.values(electiveCourses).filter(Boolean);
    const totalElectives = Object.keys(electiveCourses).length;
    const hasCompulsory = compulsoryCourses.length > 0;
    const electiveConfirmed =
      totalElectives === 0 || electedList.length === totalElectives;

    const totalSteps = (hasCompulsory ? 1 : 0) + totalElectives;
    const completedSteps = (compulsoryConfirmed ? 1 : 0) + electedList.length;

    return {
      electiveConfirmed,
      isComplete: electiveConfirmed,
      progressPercent: Math.round(
        totalSteps === 0 ? 100 : (completedSteps / totalSteps) * 100,
      ),
    };
  }, [electiveCourses, compulsoryCourses, compulsoryConfirmed]);

  const steps = useMemo(
    () =>
      [
        {
          states: {
            active: {
              label: "Required confirmed",
              style:
                "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400",
            },
            default: {
              label: "Confirm required",
              style:
                "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400",
            },
          },
          isDone: compulsoryConfirmed,
        },
        {
          states: {
            active: {
              label: "Elective chosen",
              style:
                "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400",
            },
            default: {
              label: "Choose electives",
              style:
                "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400",
            },
          },
          isDone: electiveConfirmed,
        },
      ] satisfies ProgressStep[],
    [compulsoryConfirmed, electiveConfirmed],
  );

  return (
    <div className="fixed bottom-0 w-full z-20 flex justify-center p-4 bg-gradient-to-t from-background via-background/60 to-transparent">
      <div className="w-6xl rounded-2xl border bg-card p-6 shadow-2xl ring-1 ring-foreground/5">
        <div className="flex items-center gap-8">
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center justify-between text-sm  text-muted-foreground/80">
              <span>Selection Progress</span>
              <span className="text-emerald-600">{progressPercent}%</span>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
              <div
                className="h-full bg-emerald-500 transition-all duration-700 ease-in-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {steps.map((step, idx) => (
                <ProgressBadge
                  key={`step-${idx}`}
                  id={`${idx + 1}`}
                  {...step}
                />
              ))}
            </div>
          </div>

          <div className="shrink-0">
            <ContinueButton
              disabled={!isComplete}
              electiveCourses={electiveCourses}
              bachelorCourses={bachelorCourses}
              compulsoryCourses={compulsoryCourses}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;

interface ProgressBadgeProps extends ProgressStep {
  id: string;
}

const ProgressBadge: FC<ProgressBadgeProps> = ({ id, states, isDone }) => {
  const state = states[isDone ? "active" : "default"];

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] transition-all duration-300",
        state.style,
      )}
    >
      {isDone && <Check className="h-3 w-3" />}
      {`${id}. ${state.label}`}
    </Badge>
  );
};
