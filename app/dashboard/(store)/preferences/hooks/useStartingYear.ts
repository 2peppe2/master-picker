"use client";

import { useSearchParams } from "next/navigation";

export const useStartingYear = () => {
  const params = useSearchParams();
  return parseInt(params.get("year") ?? "2023");
};
