"use client";

import {
  masterPeriodAtom,
  showBachelorYearsAtom,
} from "@/features/dashboard/state/preferences/atoms";
import { initializeSemesterAtom } from "@/features/dashboard/state/semester-ui/atoms";
import { useStartingYear } from "@/features/dashboard/state/preferences/hooks/useStartingYear";
import SemesterView from "@/features/dashboard/components/Schedule/components/SemesterView";
import DragSemesterAutoExpand from "@/features/dashboard/components/Schedule/components/DragSemesterAutoExpand";
import { useAtomValue, useSetAtom } from "jotai";
import { useLayoutEffect, useMemo } from "react";
import {
  getCurrentTermSemester,
  getVisibleSemesters,
} from "@/features/dashboard/components/Schedule/currentTerm";
import { useCurrentTermPosition } from "./hooks/useCurrentTermPosition";

const Schedule = () => {
  const showBachelorYears = useAtomValue(showBachelorYearsAtom);
  const masterPeriod = useAtomValue(masterPeriodAtom);
  const startingYear = useStartingYear();
  const initializeSemester = useSetAtom(initializeSemesterAtom);

  const semesters = useMemo(() => {
    return getVisibleSemesters(showBachelorYears, masterPeriod);
  }, [masterPeriod, showBachelorYears]);

  const currentSemester = useMemo(
    () =>
      getCurrentTermSemester({
        startingYear,
        visibleSemesters: semesters,
      }),
    [semesters, startingYear],
  );

  useLayoutEffect(() => {
    initializeSemester(currentSemester + 1);
  }, [currentSemester, initializeSemester]);

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
