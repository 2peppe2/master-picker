import { useScheduleStore } from "@/app/atoms/scheduleStore";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { useAtomValue } from "jotai";
import { range } from "lodash";
import { ChevronRightIcon } from "lucide-react";
import { PeriodView } from "./PeriodView";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { FC } from "react";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { relativeSemesterToYear } from "@/lib/semesterYearTranslations";

interface SemesterViewProps {
  semesterNumber: number;
}
export const SemesterView: FC<SemesterViewProps> = ({ semesterNumber }) => {
  const { state } = useScheduleStore();

  const schedules = state.schedules;
  const periods = schedules[semesterNumber];
  const ht_or_vt = semesterNumber % 2 === 0 ? "HT" : "VT";
  const { startingYear } = useAtomValue(userPreferencesAtom);

  const getCredits = () => {
    const semester = schedules[semesterNumber];
    const coursesInSemester = new Set(
      semester.flat().filter((block) => block !== null)
    );
    let totalCredits = 0;
    coursesInSemester.forEach((course) => {
      totalCredits += course.credits;
    });
    return totalCredits;
  };

  const PERIODS = range(0, periods.length);

  return (
    <Card className="w-full p-4 ">
      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild>
          <CardTitle className="flex gap-3">
            Semester {semesterNumber + 1}, {ht_or_vt}{" "}
            {relativeSemesterToYear(startingYear, semesterNumber)} - Credits:{" "}
            {getCredits()} / 30
            <ChevronRightIcon className="size-4 transition-transform [[data-state=open]_&]:rotate-90" />
          </CardTitle>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <div className="flex flex-col gap-4 pt-5">
              {PERIODS.map((index) => (
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
