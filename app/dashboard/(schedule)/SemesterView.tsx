import { useScheduleMutators } from "@/app/atoms/schedule/hooks/useScheduleMutators";
import { useScheduleGetters } from "@/app/atoms/schedule/hooks/useScheduleGetters";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { relativeSemesterToYear } from "@/lib/semesterYearTranslations";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRightIcon, TriangleAlert } from "lucide-react";
import SemesterSettingsModal from "./SemesterSettingsModal";
import { Slot } from "@/app/atoms/schedule/types";
import { FC, useMemo, useState } from "react";
import { PeriodView } from "./PeriodView";
import { useAtomValue } from "jotai";
import {
  scheduleAtoms,
  WILDCARD_BLOCK_START,
} from "@/app/atoms/schedule/atoms";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { range } from "lodash";

interface SemesterViewProps {
  semesterNumber: number;
}

export const SemesterView: FC<SemesterViewProps> = ({ semesterNumber }) => {
  const shownSemesters = useAtomValue(scheduleAtoms.shownSemestersAtom);
  const { getSlotPeriods } = useScheduleGetters();

  const periods = getSlotPeriods({ semester: semesterNumber });

  return (
    <Card className="w-full p-4">
      <Collapsible open={shownSemesters.has(semesterNumber + 1)}>
        <Header periods={periods} semester={semesterNumber} />
        <CollapsibleContent>
          <CardContent className="p-0">
            <div className="flex flex-col gap-4">
              {range(0, periods.length).map((index) => (
                <PeriodView
                  key={index}
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
}

const Header: FC<HeaderProps> = ({ periods, semester }) => {
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toggleShownSemester } = useScheduleMutators();

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
        onClick={() => toggleShownSemester({ semester: semester + 1 })}
      >
        <CardTitle className="flex items-center gap-3 w-full cursor-pointer">
          Semester {semester + 1}, {ht_or_vt} {relativeSemester} - Credits:{" "}
          {credits} / 30
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
