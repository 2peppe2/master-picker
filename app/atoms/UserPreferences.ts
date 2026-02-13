import { atom } from "jotai";

export const userPreferencesAtom = atom({
  startingYear: 2023,
  selectedProgram: "6CMJU",
  numberOfSemesters: 10,
  masterPeriod: {
    start: 7,
    end: 10,
  },
  showBachelorYears: false,
});
