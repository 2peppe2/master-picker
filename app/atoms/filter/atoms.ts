import { atomWithReset } from "jotai/utils";

export const filterAtoms = {
  searchAtom: atomWithReset<string>(""),
  mastersAtom: atomWithReset<string[]>([]),
  semestersAtom: atomWithReset<number[]>([]),
  periodsAtom: atomWithReset<number[]>([1, 2]),
  blocksAtom: atomWithReset<number[]>([1, 2, 3, 4]),
  excludeSlotConflictsAtom: atomWithReset<boolean>(false),
};
