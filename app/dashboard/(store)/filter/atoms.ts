import { ExaminationType } from "@/lib/examinationTypes";
import { atomWithReset } from "jotai/utils";

export const filterAtoms = {
  searchAtom: atomWithReset<string>(""),
  mastersAtom: atomWithReset<string[]>([]),
  semestersAtom: atomWithReset<number[]>([7]),
  periodsAtom: atomWithReset<number[]>([]),
  blocksAtom: atomWithReset<number[]>([]),
  levelsAtom: atomWithReset<string[]>([]),
  mainFieldsAtom: atomWithReset<string[]>([]),
  examinationTypesAtom: atomWithReset<ExaminationType[]>([]),
  // Every dimension has an "utan" counterpart: a course matching any excluded
  // value is filtered out, whatever else it matches.
  excludedMastersAtom: atomWithReset<string[]>([]),
  excludedSemestersAtom: atomWithReset<number[]>([]),
  excludedPeriodsAtom: atomWithReset<number[]>([]),
  excludedBlocksAtom: atomWithReset<number[]>([]),
  excludedLevelsAtom: atomWithReset<string[]>([]),
  excludedMainFieldsAtom: atomWithReset<string[]>([]),
  excludedExaminationTypesAtom: atomWithReset<ExaminationType[]>([]),
  excludeSlotConflictsAtom: atomWithReset<boolean>(false),
};
