import { describe, expect, it } from "vitest";
import {
  parseFilters,
  serializeFilters,
} from "@/features/dashboard/components/Drawer/components/filterStateUtils";
import {
  DEFAULT_FILTER_STATE,
  FilterState,
  filterStateAtom,
  resetFiltersAtom,
  searchAtom,
  semestersAtom,
} from "@/features/dashboard/state/filter/atoms";
import { createStore } from "jotai";

const filters: FilterState = {
  search: "machine learning",
  masters: ["AI"],
  semesters: [7, 8],
  periods: [1],
  blocks: [2, 3],
  levels: ["advanced"],
  mainFields: ["Mathematics"],
  examinationTypes: ["written_exam"],
  excludedMasters: ["Robotics"],
  excludedSemesters: [9],
  excludedPeriods: [2],
  excludedBlocks: [4],
  excludedLevels: ["basic"],
  excludedMainFields: ["Physics"],
  excludedExaminationTypes: ["lab"],
  excludeSlotConflicts: true,
};

describe("course filters", () => {
  it("serializes every visible filter category", () => {
    expect(serializeFilters(filters)).toEqual([
      "semester:7",
      "semester:8",
      "semester:!9",
      "block:2",
      "block:3",
      "block:!4",
      "period:1",
      "period:!2",
      "master:AI",
      "master:!Robotics",
      "level:advanced",
      "level:!basic",
      "mainField:Mathematics",
      "mainField:!Physics",
      "examination:written_exam",
      "examination:!lab",
      "search:machine learning",
    ]);
  });

  it("parses serialized values back into the same filter state", () => {
    expect(parseFilters(serializeFilters(filters), filters)).toEqual(filters);
  });

  it("carries excludeSlotConflicts through, since it has no option value", () => {
    expect(parseFilters([], filters).excludeSlotConflicts).toBe(true);
    expect(parseFilters([]).excludeSlotConflicts).toBe(false);
  });

  it("drops examination values that are not a known type", () => {
    const parsed = parseFilters(["examination:pottery", "examination:!lab"]);

    expect(parsed.examinationTypes).toEqual([]);
    expect(parsed.excludedExaminationTypes).toEqual(["lab"]);
  });

  it("resets every filter field to the default state", () => {
    const store = createStore();
    store.set(filterStateAtom, filters);
    store.set(resetFiltersAtom);

    expect(store.get(filterStateAtom)).toEqual(DEFAULT_FILTER_STATE);
  });

  it("updates a field without replacing unrelated filter atoms", () => {
    const store = createStore();
    store.set(semestersAtom, [8]);
    store.set(searchAtom, "algorithms");

    expect(store.get(semestersAtom)).toEqual([8]);
    expect(store.get(filterStateAtom).search).toBe("algorithms");
  });
});
