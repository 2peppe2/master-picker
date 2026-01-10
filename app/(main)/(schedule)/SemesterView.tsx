import semesterScheduleAtom from "@/app/atoms/semestersAtom";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { useAtomValue } from "jotai";
import { range } from "lodash";
import { ChevronRightIcon } from "lucide-react";
import { SemesterPeriod } from "./SemesterPeriod";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { FC } from "react";

interface SemesterViewProps {
  semesterNumber: number;
}
export const SemesterView: FC<SemesterViewProps> = ({
  semesterNumber,
}) => {
  const semesters = useAtomValue(semesterScheduleAtom);
  const periods = semesters[semesterNumber];
  const ht_or_vt = semesterNumber % 2 === 0 ? "HT" : "VT";
  
  const getCredits = () => {
    const semester = semesters[semesterNumber];
    const coursesInSemester = new Set(
      semester.flat().filter((block) => block !== null)
    );
    let totalCredits = 0;
    coursesInSemester.forEach((course) => {
      totalCredits += course.credits
    });
    return totalCredits;
  }



  const PERIODS = range(0, periods.length);

  return (
    <Card className="w-full p-4 ">
      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild>
          <CardTitle className="flex gap-3">
            Semester {semesterNumber} {ht_or_vt} - Credits: 
            {getCredits()} 
            / 30
            <ChevronRightIcon className="size-4 transition-transform [[data-state=open]_&]:rotate-90" />
          </CardTitle>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <div className="flex flex-col gap-4 pt-5">
              {PERIODS.map((index) => (
                <SemesterPeriod
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

