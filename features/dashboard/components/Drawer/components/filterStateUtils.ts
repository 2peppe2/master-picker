import {
  encodeOptionValue,
  parseOptionValue,
} from "@/components/ui/MultiSelect/polarity";
import type { FilterState } from "@/features/dashboard/state/filter/atoms";
import { DEFAULT_FILTER_STATE } from "@/features/dashboard/state/filter/atoms";
import { isExaminationType } from "@/lib/examinationTypes";

/**
 * The MultiSelect speaks a flat list of `prefix:value` strings, where a leading
 * `!` marks the excluded ("utan") polarity. Both polarities of a dimension keep
 * the same prefix, so the control still consolidates them into one badge.
 */
const encodeDimension = (
  prefix: string,
  included: (string | number)[],
  excluded: (string | number)[],
) => [
  ...included.map((value) => encodeOptionValue(prefix, value)),
  ...excluded.map((value) => encodeOptionValue(prefix, value, { negated: true })),
];

export const serializeFilters = (filters: FilterState) => [
  ...encodeDimension("semester", filters.semesters, filters.excludedSemesters),
  ...encodeDimension("block", filters.blocks, filters.excludedBlocks),
  ...encodeDimension("period", filters.periods, filters.excludedPeriods),
  ...encodeDimension("master", filters.masters, filters.excludedMasters),
  ...encodeDimension("level", filters.levels, filters.excludedLevels),
  ...encodeDimension(
    "mainField",
    filters.mainFields,
    filters.excludedMainFields,
  ),
  ...encodeDimension(
    "examination",
    filters.examinationTypes,
    filters.excludedExaminationTypes,
  ),
  ...(filters.search ? [`search:${filters.search}`] : []),
];

/** Splits one dimension's values into its included and excluded halves. */
const splitDimension = (values: string[], prefix: string) => {
  const parsed = values
    .filter((value) => value.startsWith(`${prefix}:`))
    .map(parseOptionValue);

  return {
    included: parsed.filter((part) => !part.negated).map((part) => part.value),
    excluded: parsed.filter((part) => part.negated).map((part) => part.value),
  };
};

const toNumbers = (values: string[]) => values.map(Number);

export const parseFilters = (
  values: string[],
  current: FilterState = DEFAULT_FILTER_STATE,
): FilterState => {
  const semester = splitDimension(values, "semester");
  const block = splitDimension(values, "block");
  const period = splitDimension(values, "period");
  const master = splitDimension(values, "master");
  const level = splitDimension(values, "level");
  const mainField = splitDimension(values, "mainField");
  const examination = splitDimension(values, "examination");

  const search = values
    .filter((value) => value.startsWith("search:"))
    .map((value) => value.slice("search:".length))[0];

  return {
    search: search ?? "",
    masters: master.included,
    semesters: toNumbers(semester.included),
    periods: toNumbers(period.included),
    blocks: toNumbers(block.included),
    levels: level.included,
    mainFields: mainField.included,
    examinationTypes: examination.included.filter(isExaminationType),
    excludedMasters: master.excluded,
    excludedSemesters: toNumbers(semester.excluded),
    excludedPeriods: toNumbers(period.excluded),
    excludedBlocks: toNumbers(block.excluded),
    excludedLevels: level.excluded,
    excludedMainFields: mainField.excluded,
    excludedExaminationTypes: examination.excluded.filter(isExaminationType),
    // Not represented as an option value; carried through untouched.
    excludeSlotConflicts: current.excludeSlotConflicts,
  };
};
