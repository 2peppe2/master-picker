import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { relativeSemesterToYear } from "@/lib/semesterYearTranslations";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Slot, useScheduleStore } from "@/app/atoms/schedule/scheduleStore";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRightIcon } from "lucide-react";
import { PeriodView } from "./PeriodView";
import { useAtomValue } from "jotai";
import { FC, useMemo } from "react";
import { range } from "lodash";

interface SemesterViewProps {
  semesterNumber: number;
}

export const SemesterView: FC<SemesterViewProps> = ({ semesterNumber }) => {
  const {
    state: { shownSemesters },
    getters: { getSlotPeriods },
  } = useScheduleStore();
  const periods = getSlotPeriods({ semester: semesterNumber });

  return (
    <Card className="w-full p-4 ">
      <Collapsible
        open={shownSemesters.has(semesterNumber + 1)}
      >
        <Header periods={periods} semester={semesterNumber} />
        <CollapsibleContent>
          <CardContent>
            <div className="flex flex-col gap-4 pt-5">
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

  const { mutators: { toggleShownSemester } } = useScheduleStore()

  return (
    <CollapsibleTrigger asChild onClick={() => toggleShownSemester({ semester: semester + 1 })}>
      <CardTitle className="flex gap-3">
        Semester {semester + 1}, {ht_or_vt} {relativeSemester} - Credits:{" "}
        {credits} / 30
        <ChevronRightIcon className="size-4 transition-transform [[data-state=open]_&]:rotate-90" />
      </CardTitle>
    </CollapsibleTrigger>
  );
};
