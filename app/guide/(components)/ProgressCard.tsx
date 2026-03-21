"use client";

import { Badge } from "@/components/ui/badge";
import ContinueButton from "./ContinueButton";
import { Course } from "@/app/dashboard/page";
import { CourseRequirements } from "../page";
import { AlertTriangle, Check } from "lucide-react";
import { FC, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Conflict } from "../GuideClientPage";

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
  electiveRequirements: CourseRequirements;
  bachelorCourses: Course[];
  electiveSelections: Record<number, Course[]>;
  conflicts: Conflict[];
  selectedOccasions: Record<string, number>;
}

const ProgressCard: FC<ProgressCardProps> = ({
  bachelorCourses,
  compulsoryCourses,
  electiveRequirements,
  electiveSelections,
  conflicts,
  selectedOccasions,
}) => {
  const { electiveConfirmed, progressPercent, isComplete } = useMemo(() => {
    const totalElectives = electiveRequirements.length;
    const hasCompulsory = compulsoryCourses.length > 0;
    const completedElectives = electiveRequirements.filter((group, index) => {
      const minRequired = group.minCount ?? 1;
      const selectedCount = electiveSelections[index]?.length ?? 0;
      return selectedCount >= minRequired;
    }).length;
    const electiveConfirmed =
      totalElectives === 0 || completedElectives === totalElectives;

    const totalSteps = (hasCompulsory ? 1 : 0) + totalElectives;
    const completedSteps = 1 + completedElectives;

    return {
      electiveConfirmed,
      isComplete: electiveConfirmed,
      progressPercent: Math.round(
        totalSteps === 0 ? 100 : (completedSteps / totalSteps) * 100,
      ),
    };
  }, [electiveRequirements, electiveSelections, compulsoryCourses]);

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
          isDone: true,
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
    [electiveConfirmed],
  );

  return (
    <div className="fixed bottom-0 w-full z-20 flex justify-center p-4 bg-gradient-to-t from-background via-background/60 to-transparent">
      <div className="w-6xl rounded-2xl border bg-card p-6 shadow-2xl ring-1 ring-foreground/5">
        <div className="flex items-center gap-8">
          <div className="flex flex-1 flex-col gap-3">
            {conflicts.length > 0 && (
              <div className="mb-2 flex flex-col gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 w-fit px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-500/20 shadow-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>
                    {conflicts.length} scheduling conflict{conflicts.length > 1 ? "s" : ""} detected:
                  </span>
                </div>
                <ul className="ml-5.5 space-y-0.5 list-disc font-medium opacity-90">
                  {conflicts.map((c, i) => (
                    <li key={`conflict-${i}`}>
                      {c.courseA.code} vs {c.courseB.code} in {c.semester} P{c.period}, Block {c.block}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
              disabled={!isComplete || conflicts.length > 0}
              electiveCourses={electiveSelections}
              bachelorCourses={bachelorCourses}
              compulsoryCourses={compulsoryCourses}
              selectedOccasions={selectedOccasions}
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
