"use client";

import { useStartingYear } from "./useStartingYear";
import { useProgram } from "./useProgram";

// TODO: Make this use the programs file instead to load these.
const PROGRAM_YEAR_TO_PROGRAM_ID: Record<string, Record<number, number>> = {
  "6CMJU": {
    2022: 5144,
    2023: 5430,
    2024: 5713,
    2025: 6011,
  },
  "6CDDD": {
    2022: 5155,
    2023: 5440,
    2024: 5723,
    2025: 6016,
  },
  "6CITE": {
    2022: 5142,
    2023: 5428,
    2024: 5711,
    2025: 6009,
  },
};

export const useProgramId = () => {
  const startingYear = useStartingYear();
  const program = useProgram();
  return PROGRAM_YEAR_TO_PROGRAM_ID[program][startingYear];
};
