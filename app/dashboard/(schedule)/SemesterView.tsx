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
import { FC, useMemo, useState } from "react";
import { PeriodView } from "./PeriodView";
import { useAtom, useAtomValue } from "jotai";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SemesterViewProps {
  semesterNumber: number;
}

const SemesterView: FC<SemesterViewProps> = ({ semesterNumber }) => {
  const shownSemester = useAtomValue(filterAtoms.semesterAtom);
  const isOpen = shownSemester === semesterNumber + 1;
  const { getSlotPeriods } = useScheduleGetters();

  const periods = getSlotPeriods({ semester: semesterNumber });

  return (
    <Card className="w-full p-4">
      <Collapsible open={isOpen}>
        <Header periods={periods} semester={semesterNumber} />
        <CollapsibleContent className="CollapsibleContent">
          {isOpen && (
            <CardContent className="p-0 pt-4">
              <div className="flex flex-col gap-4">
                {periods.map((_, index) => (
                  <PeriodView
                    key={index}
                    periodNumber={index}
                    semesterNumber={semesterNumber}
                  />
                ))}
              </div>
            </CardContent>
          )}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default SemesterView;

interface HeaderProps {
  periods: Slot[][];
  semester: number;
}

const Header: FC<HeaderProps> = ({ periods, semester }) => {
  const [shownSemester, setShownSemester] = useAtom(filterAtoms.semesterAtom);
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  const relativeSemester = useMemo(
    () => relativeSemesterToYear(startingYear, semester),
    [semester, startingYear],
  );

  return (
    <div className="flex items-center">
      <CollapsibleTrigger
        asChild
        onClick={() =>
          setShownSemester(
            shownSemester === semester + 1 ? "all" : semester + 1,
          )
        }
      >
        <CardTitle className="flex items-center gap-3 w-full cursor-pointer select-none">
          {hasWildcardWarning && (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <TriangleAlert className="size-5 text-yellow-500" />
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
          Semester {semester + 1}, {ht_or_vt} {relativeSemester} - Credits:{" "}
          {credits} / 30
          <ChevronRightIcon className="size-4 transition-transform [[data-state=open]_&]:rotate-90" />
        </CardTitle>
      </CollapsibleTrigger>
      <SemesterSettingsModal
        semester={semester}
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  );
};

Header.displayName = "Header";
