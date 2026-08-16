"use client";

import { useSearchParams } from "next/navigation";

/** Reads the schedule's starting academic year. */
export const useStartingYear = () => {
  const params = useSearchParams();
  return parseInt(params.get("year") ?? "2023");
};
