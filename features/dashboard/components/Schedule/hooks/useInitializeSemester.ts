"use client";

import { initializeSemesterAtom } from "@/features/dashboard/state/semester-ui/atoms";
import { useSetAtom } from "jotai";
import { useLayoutEffect } from "react";

export const useInitializeSemester = (currentSemester: number) => {
  const initializeSemester = useSetAtom(initializeSemesterAtom);

  useLayoutEffect(() => {
    initializeSemester(currentSemester + 1);
  }, [currentSemester, initializeSemester]);
};
