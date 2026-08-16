"use client";

import { useStartingYear } from "@/features/dashboard/state/preferences/hooks/useStartingYear";
import { compatibleDragSemestersAtom } from "@/features/dashboard/state/drag/atoms";
import { toggleSemesterAtom } from "@/features/dashboard/state/semester-ui/atoms";
import { WILDCARD_BLOCK_START } from "@/features/dashboard/state/schedule/atoms";
import type { Slot } from "@/features/dashboard/state/schedule/types";
import Translate from "@/common/components/translate/Translate";
import { CardTitle } from "@/components/ui/card";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { relativeSemesterToYear } from "@/lib/semesterYearTranslations";
import { useAtomValue, useSetAtom } from "jotai";
import { ChevronRightIcon, TriangleAlert } from "lucide-react";
import type { FC } from "react";
import { useMemo, useState } from "react";
import SemesterSettingsModal from "./SemesterSettingsModal";
import TimeEditSemesterButton from "./TimeEditSemesterButton";

interface SemesterHeaderProps {
  periods: Slot[][];
  semester: number;
}

const SemesterHeader: FC<SemesterHeaderProps> = ({ periods, semester }) => {
  const toggleSemester = useSetAtom(toggleSemesterAtom);
  const startingYear = useStartingYear();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const targetSemester = semester + 1;
  const compatibleSemesters = useAtomValue(compatibleDragSemestersAtom);
  const compatibleTargetCount = compatibleSemesters.find(
    (item) => item.semesterNumber === semester,
  )?.targetCount;

  const credits = useMemo(() => {
    const courses = new Set(periods.flat().filter((course) => course !== null));
    return [...courses].reduce((total, course) => total + course.credits, 0);
  }, [periods]);

  const hasWildcardWarning = useMemo(
    () =>
      periods.some((period) =>
        period.some((course, index) => {
          if (index < WILDCARD_BLOCK_START || course === null) return false;
          return course.CourseOccasion.some((occasion) =>
            occasion.periods.some(({ blocks }) => blocks.length > 0),
          );
        }),
      ),
    [periods],
  );

  const handleToggle = () => {
    toggleSemester(targetSemester);
  };

  return (
    <div className="group/header flex items-center justify-between">
      <CardTitle className="min-w-0 flex-1">
        <CollapsibleTrigger
          type="button"
          onClick={handleToggle}
          className={cn(
            "group/trigger flex w-full min-w-0 cursor-pointer",
            "select-none flex-wrap items-center gap-x-2 gap-y-1",
            "rounded-md pr-1 text-left focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring",
            "sm:gap-3",
          )}
        >
          {hasWildcardWarning && (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <TriangleAlert className="size-5 animate-pulse text-yellow-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <Translate text="_wildcard_warning_text" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <span className="min-w-0 text-sm font-bold sm:text-base">
            <Translate text="_semester_label" args={{ s: targetSemester }} />,{" "}
            {semester % 2 === 0 ? "HT" : "VT"}{" "}
            {relativeSemesterToYear(startingYear, semester)}
          </span>
          <span
            className={cn(
              "text-xs text-muted-foreground sm:text-sm",
              credits > 30 ? "text-destructive" : "text-primary",
            )}
          >
            <Translate text="_semester_credits" args={{ credits }} />
          </span>
          {compatibleTargetCount !== undefined && (
            <span
              className={cn(
                "rounded-full border border-cyan-400/60",
                "bg-cyan-500/10 px-2 py-0.5 text-xs font-medium",
                "text-cyan-600 dark:text-cyan-300",
              )}
            >
              <Translate
                text="_drag_available_slots"
                args={{ count: compatibleTargetCount }}
              />
            </span>
          )}
          <ChevronRightIcon
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              "duration-300",
              "group-data-[state=open]/trigger:rotate-90",
              "group-hover/header:text-foreground sm:size-5",
            )}
          />
        </CollapsibleTrigger>
      </CardTitle>
      <div className="ml-4 flex items-center gap-1">
        <TimeEditSemesterButton
          periods={periods}
          semester={semester % 2 === 0 ? "HT" : "VT"}
          year={relativeSemesterToYear(startingYear, semester)}
        />
        <SemesterSettingsModal
          semester={semester}
          isOpen={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
      </div>
    </div>
  );
};

export default SemesterHeader;
