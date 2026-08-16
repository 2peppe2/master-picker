"use client";

import { useStartingYear } from "@/features/dashboard/state/preferences/hooks/useStartingYear";
import { useCallback } from "react";

interface UseToRelativeSemesterArgs {
  year: number;
  semester: "HT" | "VT";
}

/** Converts an academic year/term pair into its schedule-grid index. */
export const useToRelativeSemester = () => {
  const startingYear = useStartingYear();

  return useCallback(
    ({ year, semester }: UseToRelativeSemesterArgs) => {
      const yearDiff = year - startingYear;
      if (yearDiff < 0) {
        throw new Error("year must be >= startingYear");
      }

      return semester === "HT" ? yearDiff * 2 : yearDiff * 2 - 1;
    },
    [startingYear],
  );
};
