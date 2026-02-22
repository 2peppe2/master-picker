"use client";

import { ReadonlyURLSearchParams } from "next/navigation";
import { coursesAtom } from "../coursesAtom";
import { scheduleAtoms } from "./atoms";
import { ScheduleGrid } from "./types";
import { atom } from "jotai";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

const PARAM_NAME = "schedule";

/**
 * Represents a single course placement in the grid.
 * [semesterIndex, periodIndex, blockIndex, courseIndex]
 */
type ScheduleEntry = [number, number, number, number];

/**
 * The structure of the data stored in the URL.
 * Designed for maximum compression while maintaining layout rules.
 */
interface SchedulePayload {
  /** * Stands for semesters.
   *
   * Each number represents the block count for BOTH Period 0 and Period 1
   * within that semester.
   * Example: [9, 7] = Sem 0 (2x9 blocks), Sem 1 (2x7 blocks)
   */
  s: number[];

  /** * Stands for Data.
   *
   * A list of entries representing only the non-empty slots in the grid.
   */
  d: ScheduleEntry[];
}

interface WriteScheduleToUrlAtomArgs {
  searchParams: ReadonlyURLSearchParams;
  setSearchParam: (name: string, value: string | null) => void;
}

export const writeScheduleToUrlAtom = atom(
  null,
  (get, _set, { searchParams, setSearchParam }: WriteScheduleToUrlAtomArgs) => {
    const courses = get(coursesAtom);
    const grid = get(scheduleAtoms.schedulesAtom);

    // Guard against empty state
    if (!grid.length || Object.keys(courses).length === 0) return;

    const courseKeys = Object.keys(courses).sort();
    const entries: ScheduleEntry[] = [];

    /**
     * Store the "Shape" of the semesters.
     * Since Period 0 and Period 1 always have the same block count,
     * we only need to store the length of the first period per semester.
     */
    const semesterBlockCounts: number[] = grid.map(
      (semester) => semester[0].length || 0,
    );

    grid.forEach((semester, sIdx) =>
      semester.forEach((period, pIdx) =>
        period.forEach((block, bIdx) => {
          if (block?.code) {
            const courseIdx = courseKeys.indexOf(block.code);
            if (courseIdx !== -1) {
              entries.push([sIdx, pIdx, bIdx, courseIdx]);
            }
          }
        }),
      ),
    );

    const payload: SchedulePayload = {
      s: semesterBlockCounts,
      d: entries,
    };

    const compressed = compressToEncodedURIComponent(JSON.stringify(payload));

    if (searchParams.get(PARAM_NAME) !== compressed) {
      setSearchParam(PARAM_NAME, compressed);
    }
  },
);

export const readScheduleFromUrlAtom = atom(
  null,
  (get, set, searchParams: ReadonlyURLSearchParams) => {
    const param = searchParams.get(PARAM_NAME);
    const courses = get(coursesAtom);
    const courseKeys = Object.keys(courses).sort();

    if (!param || courseKeys.length === 0) return;

    try {
      const decompressed = decompressFromEncodedURIComponent(param);
      if (!decompressed) return;

      const payload = JSON.parse(decompressed) as SchedulePayload;
      const { s: semesterBlockCounts, d: entries } = payload;

      /**
       * Reconstruct the jagged grid structure.
       * For every semester length in 's', we create two periods of that size.
       */
      const newGrid: ScheduleGrid = semesterBlockCounts.map((blockCount) => [
        Array.from({ length: blockCount }, () => null), // Period 0
        Array.from({ length: blockCount }, () => null), // Period 1
      ]);

      // Populate the courses into the newly built structure
      entries.forEach(([sIdx, pIdx, bIdx, cIdx]) => {
        const code = courseKeys[cIdx];

        // Ensure the semester and period exist before assignment to prevent crashes
        if (code && courses[code] && newGrid[sIdx]?.[pIdx]) {
          newGrid[sIdx][pIdx][bIdx] = courses[code];
        }
      });

      set(scheduleAtoms.schedulesAtom, newGrid);
    } catch (e) {
      console.error("Failed to restore schedule from URL payload", e);
    }
  },
);
