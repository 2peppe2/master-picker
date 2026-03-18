"use client";

import { useSearchParams } from "next/navigation";

export const useProgram = () => {
  const params = useSearchParams();
  return params.get("program") ?? "6CMJU";
};
