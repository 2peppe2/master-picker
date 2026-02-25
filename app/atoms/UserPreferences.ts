import { atom } from "jotai";

export const userPreferencesAtom = atom({
  startingYear: 2023,
  selectedProgram: "6CMJU",
  programId: 2040,
  numberOfSemesters: 10,
  masterPeriod: {
    start: 7,
    end: 10,
  },
  showBachelorYears: false,
});
