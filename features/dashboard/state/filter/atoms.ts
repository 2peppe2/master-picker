import type { ExaminationType } from "@/lib/examinationTypes";
import { atom } from "jotai";
import type { SetStateAction } from "react";

/**
 * Every dimension has an "utan" counterpart: a course matching any excluded
 * value is filtered out, whatever else it matches.
 */
export interface FilterState {
  search: string;
  masters: string[];
  semesters: number[];
  periods: number[];
  blocks: number[];
  levels: string[];
  mainFields: string[];
  examinationTypes: ExaminationType[];
  excludedMasters: string[];
  excludedSemesters: number[];
  excludedPeriods: number[];
  excludedBlocks: number[];
  excludedLevels: string[];
  excludedMainFields: string[];
  excludedExaminationTypes: ExaminationType[];
  excludeSlotConflicts: boolean;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  search: "",
  masters: [],
  semesters: [7],
  periods: [],
  blocks: [],
  levels: [],
  mainFields: [],
  examinationTypes: [],
  excludedMasters: [],
  excludedSemesters: [],
  excludedPeriods: [],
  excludedBlocks: [],
  excludedLevels: [],
  excludedMainFields: [],
  excludedExaminationTypes: [],
  excludeSlotConflicts: false,
};

export const searchAtom = atom(DEFAULT_FILTER_STATE.search);
export const mastersAtom = atom(DEFAULT_FILTER_STATE.masters);
export const semestersAtom = atom(DEFAULT_FILTER_STATE.semesters);
export const periodsAtom = atom(DEFAULT_FILTER_STATE.periods);
export const blocksAtom = atom(DEFAULT_FILTER_STATE.blocks);
export const levelsAtom = atom(DEFAULT_FILTER_STATE.levels);
export const mainFieldsAtom = atom(DEFAULT_FILTER_STATE.mainFields);
export const examinationTypesAtom = atom(
  DEFAULT_FILTER_STATE.examinationTypes,
);
export const excludedMastersAtom = atom(DEFAULT_FILTER_STATE.excludedMasters);
export const excludedSemestersAtom = atom(
  DEFAULT_FILTER_STATE.excludedSemesters,
);
export const excludedPeriodsAtom = atom(DEFAULT_FILTER_STATE.excludedPeriods);
export const excludedBlocksAtom = atom(DEFAULT_FILTER_STATE.excludedBlocks);
export const excludedLevelsAtom = atom(DEFAULT_FILTER_STATE.excludedLevels);
export const excludedMainFieldsAtom = atom(
  DEFAULT_FILTER_STATE.excludedMainFields,
);
export const excludedExaminationTypesAtom = atom(
  DEFAULT_FILTER_STATE.excludedExaminationTypes,
);
export const excludeSlotConflictsAtom = atom(
  DEFAULT_FILTER_STATE.excludeSlotConflicts,
);

export const filterStateAtom = atom(
  (get): FilterState => ({
    search: get(searchAtom),
    masters: get(mastersAtom),
    semesters: get(semestersAtom),
    periods: get(periodsAtom),
    blocks: get(blocksAtom),
    levels: get(levelsAtom),
    mainFields: get(mainFieldsAtom),
    examinationTypes: get(examinationTypesAtom),
    excludedMasters: get(excludedMastersAtom),
    excludedSemesters: get(excludedSemestersAtom),
    excludedPeriods: get(excludedPeriodsAtom),
    excludedBlocks: get(excludedBlocksAtom),
    excludedLevels: get(excludedLevelsAtom),
    excludedMainFields: get(excludedMainFieldsAtom),
    excludedExaminationTypes: get(excludedExaminationTypesAtom),
    excludeSlotConflicts: get(excludeSlotConflictsAtom),
  }),
  (get, set, update: SetStateAction<FilterState>) => {
    const next =
      typeof update === "function" ? update(get(filterStateAtom)) : update;

    set(searchAtom, next.search);
    set(mastersAtom, next.masters);
    set(semestersAtom, next.semesters);
    set(periodsAtom, next.periods);
    set(blocksAtom, next.blocks);
    set(levelsAtom, next.levels);
    set(mainFieldsAtom, next.mainFields);
    set(examinationTypesAtom, next.examinationTypes);
    set(excludedMastersAtom, next.excludedMasters);
    set(excludedSemestersAtom, next.excludedSemesters);
    set(excludedPeriodsAtom, next.excludedPeriods);
    set(excludedBlocksAtom, next.excludedBlocks);
    set(excludedLevelsAtom, next.excludedLevels);
    set(excludedMainFieldsAtom, next.excludedMainFields);
    set(excludedExaminationTypesAtom, next.excludedExaminationTypes);
    set(excludeSlotConflictsAtom, next.excludeSlotConflicts);
  },
);

export const resetFiltersAtom = atom(null, (_get, set) => {
  set(filterStateAtom, DEFAULT_FILTER_STATE);
});
