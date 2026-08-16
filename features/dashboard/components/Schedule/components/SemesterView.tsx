"use client";

import { cn } from "@/lib/utils";

import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { semesterAtom } from "@/features/dashboard/state/schedule/atoms";
import { Card, CardContent } from "@/components/ui/card";
import { isSemesterExpandedAtom } from "@/features/dashboard/state/semester-ui/atoms";
import { useAtomValue } from "jotai";
import { FC } from "react";
import PeriodView from "./PeriodView";
import SemesterHeader from "./SemesterHeader";
import { useRevealSemesterOnCourseAdded } from "../hooks/useRevealSemesterOnCourseAdded";

interface SemesterViewProps {
  semesterNumber: number;
  isCurrent?: boolean;
}

const SemesterView: FC<SemesterViewProps> = ({
  semesterNumber,
  isCurrent = false,
}) => {
  const target = semesterNumber + 1;
  const isOpen = useAtomValue(isSemesterExpandedAtom(target));

  useRevealSemesterOnCourseAdded(semesterNumber);

  const periods = useAtomValue(semesterAtom(semesterNumber));

  return (
    <Card
      data-semester-index={semesterNumber}
      data-current-semester={isCurrent ? "true" : undefined}
      className={cn(
        "h-min-content w-full scroll-mt-4 gap-4",
        "border-border/50 p-3 shadow-sm transition-shadow",
        "hover:shadow-md sm:scroll-mt-6 sm:p-4",
      )}
    >
      <Collapsible open={isOpen}>
        <SemesterHeader periods={periods} semester={semesterNumber} />

        <CollapsibleContent
          className={cn(
            "overflow-hidden transition-all",
            "data-[state=closed]:animate-collapsible-up",
            "data-[state=open]:animate-collapsible-down",
          )}
        >
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

export default SemesterView;
