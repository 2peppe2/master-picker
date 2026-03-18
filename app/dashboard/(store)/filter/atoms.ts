import { atomWithReset } from "jotai/utils";

export const filterAtoms = {
  searchAtom: atomWithReset<string>(""),
  mastersAtom: atomWithReset<string[]>([]),
  semestersAtom: atomWithReset<number[]>([7]),
  periodsAtom: atomWithReset<number[]>([]),
  blocksAtom: atomWithReset<number[]>([]),
  levelsAtom: atomWithReset<string[]>([]),
  mainFieldsAtom: atomWithReset<string[]>([]),
  excludeSlotConflictsAtom: atomWithReset<boolean>(false),
};
