"use client";

import { useStartingYear } from "@/features/dashboard/state/preferences/hooks/useStartingYear";
import { compatibleTargetCountAtom } from "@/features/dashboard/state/drag/atoms";
import {
  isSemesterExpandedAtom,
  toggleSemesterAtom,
} from "@/features/dashboard/state/semester-ui/atoms";
import {
  semesterAtom,
  WILDCARD_BLOCK_START,
} from "@/features/dashboard/state/schedule/atoms";
import Translate from "@/common/components/translate/Translate";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { Button } from "@/components/ui/button";
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
  semester: number;
}

const SemesterHeader: FC<SemesterHeaderProps> = ({ semester }) => {
  const toggleSemester = useSetAtom(toggleSemesterAtom);
  const startingYear = useStartingYear();
  const translate = useCommonTranslate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const periods = useAtomValue(semesterAtom(semester));
  const targetSemester = semester + 1;
  const isExpanded = useAtomValue(isSemesterExpandedAtom(targetSemester));
  const compatibleTargetCount = useAtomValue(
    compatibleTargetCountAtom(semester),
  );
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
  const semesterYear = relativeSemesterToYear(startingYear, semester);
  const handleToggle = () => toggleSemester(targetSemester);

  return (
    <div
      className={cn(
        "group/header flex items-start justify-between gap-2",
        "sm:items-center",
      )}
    >
      <CardTitle className="min-w-0 flex-1">
        <CollapsibleTrigger
          type="button"
          onClick={handleToggle}
          className={cn(
            "group/trigger flex w-full min-w-0 cursor-pointer",
            "select-none flex-col items-start gap-y-0.5",
            "rounded-md pr-1 text-left focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring",
            "sm:flex-row sm:flex-wrap sm:items-center sm:gap-3",
          )}
        >
          <span
            className={cn(
              "flex w-full min-w-0 items-center gap-2",
              "sm:w-auto sm:gap-3",
            )}
          >
            {hasWildcardWarning && (
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <TriangleAlert
                      className={cn(
                        "size-4 shrink-0 animate-pulse",
                        "text-yellow-500 sm:size-5",
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <Translate text="_wildcard_warning_text" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <span className="min-w-0 truncate text-sm font-bold sm:text-base">
              <Translate text="_semester_label" args={{ s: targetSemester }} />,{" "}
              {semester % 2 === 0 ? "HT" : "VT"}{" "}
              {semesterYear}
            </span>
          </span>
          <span
            className={cn(
              "flex min-w-0 flex-wrap items-center gap-2",
              "sm:contents",
            )}
          >
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
          </span>
          <ChevronRightIcon
            className={cn(
              "hidden size-4 text-muted-foreground transition-transform",
              "duration-300",
              "group-data-[state=open]/trigger:rotate-90",
              "group-hover/header:text-foreground sm:block sm:size-5",
            )}
          />
        </CollapsibleTrigger>
      </CardTitle>
      <div className="ml-2 flex shrink-0 items-center gap-1 sm:ml-4">
        <TimeEditSemesterButton
          periods={periods}
          semester={semester % 2 === 0 ? "HT" : "VT"}
          year={semesterYear}
        />
        <SemesterSettingsModal
          semester={semester}
          isOpen={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
        {/* Phones keep the expander with the other row actions instead of
            inside the title, which stays cramped on narrow screens. */}
        <Button
          variant="ghost"
          size="icon"
          className="size-(--touch-sm) hover:bg-accent sm:hidden"
          aria-expanded={isExpanded}
          aria-label={translate("_semester_label", { s: targetSemester })}
          onClick={handleToggle}
        >
          <ChevronRightIcon
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              "duration-300",
              isExpanded && "rotate-90",
            )}
          />
        </Button>
      </div>
    </div>
  );
};

export default SemesterHeader;
