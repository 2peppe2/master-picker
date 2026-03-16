"use client";

import { preferenceAtoms } from "../../(store)/preferences/atoms";
import { scheduleAtoms } from "../../(store)/schedule/atoms";
import SemesterView from "./components/SemesterView";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { range } from "lodash";

const Schedule = () => {
  const showBachelorYears = useAtomValue(preferenceAtoms.showBachelorYearsAtom);
  const masterPeriod = useAtomValue(preferenceAtoms.masterPeriodAtom);
  const schedules = useAtomValue(scheduleAtoms.schedulesAtom);

  const semesters = useMemo(() => {
    if (showBachelorYears) {
      return range(0, schedules.length);
    }

    return range(masterPeriod.start - 1, masterPeriod.end);
  }, [masterPeriod, schedules.length, showBachelorYears]);

  return (
    <>
      {semesters.map((index) => (
        <SemesterView key={index} semesterNumber={index} />
      ))}
    </>
  );
};

export default Schedule;
