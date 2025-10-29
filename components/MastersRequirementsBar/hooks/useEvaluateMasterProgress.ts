import { useCallback, useMemo } from "react";
import { useAtomValue } from "jotai";

import { MasterRequirement } from "../types";
import semestersAtom from "@/app/semesterStore";
import { COURSES } from "@/app/courses";

interface MasterProgress {
  progress: number;
  fulfilled: MasterRequirement[];
}

export const useEvaluateMasterProgress = () => {
  const semesters = useAtomValue(semestersAtom);

  const selectedCourses = useMemo(
    () => semesters.flat(2).filter((course) => course !== null),
    [semesters]
  );

  return useCallback(
    (requirements: MasterRequirement[]): MasterProgress => ({
      progress: 0,
      fulfilled: [],
    }),
    []
  );
};
