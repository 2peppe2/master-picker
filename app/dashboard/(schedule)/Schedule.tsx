"use client";

import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { scheduleAtoms } from "@/app/atoms/schedule/atoms";
import SemesterView from "./SemesterView";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { range } from "lodash";

const Schedule = () => {
  const schedules = useAtomValue(scheduleAtoms.schedulesAtom);
  const { showBachelorYears, masterPeriod } = useAtomValue(userPreferencesAtom);

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
