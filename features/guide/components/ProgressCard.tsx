"use client";

import Translate from "@/common/components/translate/Translate";
import { Badge } from "@/components/ui/badge";
import ContinueButton from "./ContinueButton";
import { Course } from "@/common/types";
import type { CourseRequirements } from "@/features/guide/types";
import { Check } from "lucide-react";
import { FC, useMemo } from "react";
import { cn } from "@/lib/utils";

interface ProgressStep {
  states: {
    active: {
      labelKey: string;
      style: string;
    };
    default: {
      labelKey: string;
      style: string;
    };
  };
  isDone: boolean;
}

interface ProgressCardProps {
  compulsoryCourses: CourseRequirements;
  electiveRequirements: CourseRequirements;
  bachelorCourses: Course[];
  electiveSelections: Record<number, Course[]>;
}

const ProgressCard: FC<ProgressCardProps> = ({
  bachelorCourses,
  compulsoryCourses,
  electiveRequirements,
  electiveSelections,
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
              labelKey: "_guide_step_required_done",
              style:
                "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400",
            },
            default: {
              labelKey: "_guide_step_required_todo",
              style:
                "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400",
            },
          },
          isDone: true,
        },
        {
          states: {
            active: {
              labelKey: "_guide_step_elective_done",
              style:
                "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400",
            },
            default: {
              labelKey: "_guide_step_elective_todo",
              style:
                "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400",
            },
          },
          isDone: electiveConfirmed,
        },
      ] satisfies ProgressStep[],
    [electiveConfirmed],
  );

  // Fixed to the bottom edge, so in landscape it needs the inline insets too --
  // that is the orientation where the notch sits on a side.
  return (
    <div
      className={cn(
        "fixed bottom-0 z-20 flex w-full justify-center",
        "bg-gradient-to-t from-background via-background/80 to-transparent",
        "p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:p-4",
        "landscape-phone:p-1",
        "landscape-phone:ps-[calc(0.25rem+env(safe-area-inset-left))]",
        "landscape-phone:pe-[calc(0.25rem+env(safe-area-inset-right))]",
      )}
    >
      <div
        className={cn(
          "w-full max-w-6xl rounded-2xl border bg-card p-3 shadow-2xl",
          "ring-1 ring-foreground/5 sm:p-4 lg:p-6",
          "landscape-phone:rounded-xl landscape-phone:p-2",
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8",
            "landscape-phone:gap-3",
          )}
        >
          <div className="flex flex-1 flex-col gap-3 landscape-phone:gap-1.5">
            <div className="flex items-center justify-between text-sm  text-muted-foreground/80">
              <span>
                <Translate text="_guide_progress_selection" />
              </span>
              <span className="text-emerald-600">{progressPercent}%</span>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
              <div
                className="h-full bg-emerald-500 transition-all duration-700 ease-in-out motion-reduce:transition-none"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Wrapping to a second row is what pushes the fixed bar past a
                third of a landscape viewport; it scrolls sideways instead. */}
            <div
              className={cn(
                "flex flex-wrap gap-2",
                "landscape-phone:flex-nowrap landscape-phone:gap-1",
                "landscape-phone:overflow-x-auto",
                "landscape-phone:[scrollbar-width:none]",
                "landscape-phone:[&::-webkit-scrollbar]:hidden",
              )}
            >
              {steps.map((step, idx) => (
                <ProgressBadge
                  key={`step-${idx}`}
                  id={`${idx + 1}`}
                  {...step}
                />
              ))}
            </div>
          </div>

          <div className="w-full shrink-0 sm:w-auto">
            <ContinueButton
              disabled={!isComplete}
              electiveCourses={electiveSelections}
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
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-2xs transition-all duration-300",
        state.style,
      )}
    >
      {isDone && <Check className="h-3 w-3" />}
      {`${id}. `}
      <Translate text={state.labelKey} />
    </Badge>
  );
};
