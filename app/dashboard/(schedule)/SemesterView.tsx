import { useScheduleMutators } from "@/app/atoms/schedule/hooks/useScheduleMutators";
import { useScheduleGetters } from "@/app/atoms/schedule/hooks/useScheduleGetters";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { relativeSemesterToYear } from "@/lib/semesterYearTranslations";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { scheduleAtoms } from "@/app/atoms/schedule/atoms";
import { ChevronRightIcon, Ellipsis } from "lucide-react";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Slot } from "@/app/atoms/schedule/types";
import { Button } from "@/components/ui/button";
import { FC, useMemo, useState } from "react";
import { PeriodView } from "./PeriodView";
import { useAtomValue } from "jotai";
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
  const [popoverOpen, setPopoverOpen] = useState(false);
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

  const relativeSemester = useMemo(
    () => relativeSemesterToYear(startingYear, semester),
    [semester, startingYear],
  );

  const { toggleShownSemester, addBlockToSemester } = useScheduleMutators();

  return (
    <div className="flex items-center">
      <CollapsibleTrigger
        asChild
        onClick={() => toggleShownSemester({ semester: semester + 1 })}
      >
        <CardTitle className="flex gap-3 w-full">
          Semester {semester + 1}, {ht_or_vt} {relativeSemester} - Credits:{" "}
          {credits} / 30
          <ChevronRightIcon className="size-4 transition-transform [[data-state=open]_&]:rotate-90" />
        </CardTitle>
      </CollapsibleTrigger>

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Ellipsis className="size-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="end" className="w-48 p-2">
          <div className="grid gap-1">
            <div className="px-2 py-1.5 text-sm font-semibold">Options</div>
            <Button
              onClick={() => {
                addBlockToSemester({ semester });
                setPopoverOpen(false);
              }}
              variant="ghost"
              className="h-8 justify-start text-sm font-normal"
            >
              Add extra block
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
