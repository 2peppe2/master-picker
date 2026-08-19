"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface UseToRelativeSemesterArgs {
  year: number;
  semester: "HT" | "VT";
}

export const useToRelativeSemester = () => {
  const params = useSearchParams();
  const startingYear = Number.parseInt(params.get("year") ?? "2023", 10);

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
