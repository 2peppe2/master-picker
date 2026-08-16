"use client";

import { useSearchParams } from "next/navigation";

/** Reads the selected program preference. */
export const useProgram = () => {
  const params = useSearchParams();
  return params.get("program") ?? "6CMJU";
};
