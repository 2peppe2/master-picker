"use client";

import programs from "@/data/starting_year_programs.json";
import { useStartingYear } from "./useStartingYear";
import { useProgram } from "./useProgram";
import { useMemo } from "react";

export const useProgramId = () => {
  const startingYear = useStartingYear();
  const program = useProgram();

  return useMemo(() => {
    const programData = programs.find((p) => p.id === program);
    const yearData = programData?.years.find((y) => y.year === startingYear);

    return yearData?.id;
  }, [startingYear, program]);
};
