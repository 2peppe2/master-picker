"use client";

import { useScheduleGetters } from "@/app/dashboard/(store)/schedule/hooks/useScheduleGetters";
import { useStartingYear } from "@/app/dashboard/(store)/preferences/hooks/useStartingYear";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { WILDCARD_BLOCK_START } from "@/app/dashboard/(store)/schedule/atoms";
import { relativeSemesterToYear } from "@/lib/semesterYearTranslations";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { filterAtoms } from "@/app/dashboard/(store)/filter/atoms";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRightIcon, TriangleAlert } from "lucide-react";
import { Slot } from "@/app/dashboard/(store)/schedule/types";
import SemesterSettingsModal from "./SemesterSettingsModal";
import { useAtomValue, useSetAtom } from "jotai";
import { FC, useMemo, useState } from "react";
import PeriodView from "./PeriodView";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";

interface SemesterViewProps {
  semesterNumber: number;
}

const SemesterView: FC<SemesterViewProps> = ({ semesterNumber }) => {
  const shownSemesters = useAtomValue(filterAtoms.semestersAtom);
  const target = semesterNumber + 1;

  const [isOpen, setIsOpen] = useState(() => shownSemesters.includes(target));

  const { getSlotPeriods } = useScheduleGetters();
  const periods = getSlotPeriods({ semester: semesterNumber });

  return (
    <Card className="w-full p-4 h-min-content border-border/50 shadow-sm transition-shadow hover:shadow-md">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Header
          periods={periods}
          semester={semesterNumber}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

        <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <CardContent className="p-0 pt-6">
            <div className="flex flex-col gap-6">
              {periods.map((_, index) => (
                <PeriodView
                  key={`${semesterNumber}-period-${index}`}
                  periodNumber={index}
                  semesterNumber={semesterNumber}
                />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

interface HeaderProps {
  periods: Slot[][];
  semester: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Header: FC<HeaderProps> = ({ periods, semester, isOpen, setIsOpen }) => {
  const t = useCommonTranslate();
  const setShownSemesters = useSetAtom(filterAtoms.semestersAtom);
  const startingYear = useStartingYear();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const targetSemester = semester + 1;
  const ht_or_vt = semester % 2 === 0 ? "HT" : "VT";

  const credits = useMemo(() => {
    const coursesInSemester = new Set(
      periods.flat().filter((block) => block !== null),
    );
    return [...coursesInSemester].reduce(
      (acc, curr) => (acc += curr.credits),
      0,
    );
  }, [periods]);

  const hasWildcardWarning = useMemo(() => {
    return periods.some((period) =>
      period.some((course, index) => {
        if (index < WILDCARD_BLOCK_START || course === null) return false;
        const hasSpecificBlocks = course.CourseOccasion.some((occ) =>
          occ.periods.some((p) => p.blocks.length > 0),
        );
        return hasSpecificBlocks;
      }),
    );
  }, [periods]);

  const relativeSemesterYear = useMemo(
    () => relativeSemesterToYear(startingYear, semester),
    [semester, startingYear],
  );

  const handleToggle = () => {
    const willBeOpen = !isOpen;

    // Update optimistic
    setIsOpen(willBeOpen);

    // Update actual state.
    setTimeout(() => {
      setShownSemesters((prev) => {
        if (willBeOpen) {
          return prev.includes(targetSemester)
            ? prev
            : [...prev, targetSemester];
        } else {
          return prev.filter((s) => s.toString() !== targetSemester.toString());
        }
      });
    }, 500);
  };

  return (
    <div className="flex items-center justify-between group/header">
      <CollapsibleTrigger
        asChild
        onClick={(e) => {
          e.preventDefault();
          handleToggle();
        }}
      >
        <CardTitle className="flex items-center gap-3 w-full cursor-pointer select-none">
          {hasWildcardWarning && (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <TriangleAlert className="size-5 text-yellow-500 animate-pulse" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {t("_wildcard_warning_text")}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <span className="font-bold tracking-tight">
            {t("_semester_label", { s: targetSemester })}, {ht_or_vt} {relativeSemesterYear}
          </span>

          <span
            className={cn(
              "text-sm text-muted-foreground",
              credits > 30 ? "text-destructive" : "text-primary",
            )}
          >
            {t("_semester_credits", { credits })}
          </span>
          <ChevronRightIcon className="size-5 text-muted-foreground transition-transform duration-300 [[data-state=open]_&]:rotate-90 group-hover/header:text-foreground" />
        </CardTitle>
      </CollapsibleTrigger>

      <div className="ml-4">
        <SemesterSettingsModal
          semester={semester}
          isOpen={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
      </div>
    </div>
  );
};

export default SemesterView;
