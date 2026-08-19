"use client";

import {
  masterPeriodAtom,
  showBachelorYearsAtom,
} from "@/features/dashboard/state/preferences/atoms";
import { useStartingYear } from "@/features/dashboard/state/preferences/hooks/useStartingYear";
import SemesterView from "@/features/dashboard/components/Schedule/components/SemesterView";
import DragSemesterAutoExpand from "@/features/dashboard/components/Schedule/components/DragSemesterAutoExpand";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import {
  getCurrentTermSemester,
  getVisibleSemesters,
} from "@/features/dashboard/components/Schedule/currentTerm";
import { useCurrentTermPosition } from "./hooks/useCurrentTermPosition";
import { useInitializeSemester } from "./hooks/useInitializeSemester";

const Schedule = () => {
  const showBachelorYears = useAtomValue(showBachelorYearsAtom);
  const masterPeriod = useAtomValue(masterPeriodAtom);
  const startingYear = useStartingYear();
  const semesters = useMemo(
    () => getVisibleSemesters(showBachelorYears, masterPeriod),
    [masterPeriod, showBachelorYears],
  );
  const currentSemester = useMemo(
    () =>
      getCurrentTermSemester({
        startingYear,
        visibleSemesters: semesters,
      }),
    [semesters, startingYear],
  );

  useInitializeSemester(currentSemester);
  useCurrentTermPosition(currentSemester);

  return (
    <>
      <DragSemesterAutoExpand />
      <div className="flex flex-col gap-4 pb-40">
        {semesters.map((index) => (
          <SemesterView
            key={index}
            semesterNumber={index}
            isCurrent={index === currentSemester}
          />
        ))}
      </div>
    </>
  );
};

export default Schedule;
