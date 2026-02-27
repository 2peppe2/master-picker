import { atomWithReset } from "jotai/utils";
import { SemesterOption } from "./types";

// TODO: Add examples for the atoms here.
export const filterAtoms = {
  searchAtom: atomWithReset<string>(""),
  masterAtom: atomWithReset<string>("all"),
  semesterAtom: atomWithReset<SemesterOption>("all"),
  periodsAtom: atomWithReset<number[]>([1, 2]),
  blocksAtom: atomWithReset<number[]>([1, 2, 3, 4]),
  excludeSlotConflictsAtom: atomWithReset<boolean>(false),
};
