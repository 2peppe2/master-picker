"use client";

import { useScheduleGetters } from "@/app/atoms/schedule/hooks/useScheduleGetters";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { relativeSemesterToYear } from "@/lib/semesterYearTranslations";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { WILDCARD_BLOCK_START } from "@/app/atoms/schedule/atoms";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRightIcon, TriangleAlert } from "lucide-react";
import SemesterSettingsModal from "./SemesterSettingsModal";
import { filterAtoms } from "@/app/atoms/filter/atoms";
import { Slot } from "@/app/atoms/schedule/types";
import { useAtomValue, useSetAtom } from "jotai";
import { FC, useEffect, useMemo, useState } from "react";
import { PeriodView } from "./PeriodView";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SemesterViewProps {
  semesterNumber: number;
}

const SemesterView: FC<SemesterViewProps> = ({ semesterNumber }) => {
  const shownSemesters = useAtomValue(filterAtoms.semestersAtom);
  const target = semesterNumber + 1;

  const [isOpen, setIsOpen] = useState(() => shownSemesters.includes(target));

  const { getSlotPeriods } = useScheduleGetters();
  const periods = getSlotPeriods({ semester: semesterNumber });

  useEffect(() => {
    setIsOpen(shownSemesters.includes(target));
  }, [shownSemesters, target]);

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
  const setShownSemesters = useSetAtom(filterAtoms.semestersAtom);
  const { startingYear } = useAtomValue(userPreferencesAtom);
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
    }, 300);
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
                    Potential collision: A standard course is in a wildcard
                    slot.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <span className="font-bold tracking-tight">
            Semester {targetSemester}, {ht_or_vt} {relativeSemesterYear}
          </span>

          <span
            className={cn(
              "text-sm text-muted-foreground",
              credits > 30 ? "text-destructive" : "text-primary",
            )}
          >
            Credits {credits} / 30 HP
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
