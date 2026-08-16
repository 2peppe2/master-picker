import { describe, expect, it } from "vitest";
import { createStore } from "jotai";
import { blocksAtom, periodsAtom, semestersAtom } from "@/features/dashboard/state/filter/atoms";
import {
  autoExpandedSemestersAtom,
  autoOpenSemesterAtom,
  clearAutoExpandedSemestersAtom,
  closeAutoExpandedSemesterAtom,
  expandedSemestersAtom,
  focusScheduleSlotAtom,
  initializeSemesterAtom,
  isSemesterExpandedAtom,
  openSemesterAtom,
  retainAutoExpandedSemesterAtom,
  toggleSemesterAtom,
} from "@/features/dashboard/state/semester-ui/atoms";

describe("semester dashboard state", () => {
  it("coordinates expansion and semester filtering through one command", () => {
    const store = createStore();
    store.set(initializeSemesterAtom, 7);
    store.set(toggleSemesterAtom, 8);
    expect(store.get(expandedSemestersAtom)).toEqual([7, 8]);
    expect(store.get(semestersAtom)).toEqual([7, 8]);
    store.set(toggleSemesterAtom, 8);
    expect(store.get(expandedSemestersAtom)).toEqual([7]);
    expect(store.get(semestersAtom)).toEqual([7]);
  });

  it("opens and focuses the requested schedule slot", () => {
    const store = createStore();
    store.set(openSemesterAtom, 7);
    store.set(focusScheduleSlotAtom, { semester: 8, period: 2, block: 3 });
    expect(store.get(expandedSemestersAtom)).toEqual([7, 8]);
    expect(store.get(semestersAtom)).toEqual([8]);
    expect(store.get(periodsAtom)).toEqual([2]);
    expect(store.get(blocksAtom)).toEqual([3]);
    expect(store.get(isSemesterExpandedAtom(7))).toBe(true);
    expect(store.get(isSemesterExpandedAtom(8))).toBe(true);
  });

  it("cleans up only auto-expanded semesters unless they are retained", () => {
    const store = createStore();
    store.set(initializeSemesterAtom, 7);
    store.set(autoOpenSemesterAtom, 8);
    expect(store.get(autoExpandedSemestersAtom)).toEqual([{ semester: 8, filterWasIncluded: false }]);
    store.set(closeAutoExpandedSemesterAtom, 8);
    expect(store.get(expandedSemestersAtom)).toEqual([7]);
    expect(store.get(semestersAtom)).toEqual([7]);

    store.set(autoOpenSemesterAtom, 8);
    store.set(retainAutoExpandedSemesterAtom, 8);
    store.set(clearAutoExpandedSemestersAtom);
    expect(store.get(expandedSemestersAtom)).toEqual([7, 8]);
    expect(store.get(autoExpandedSemestersAtom)).toEqual([]);
  });
});
