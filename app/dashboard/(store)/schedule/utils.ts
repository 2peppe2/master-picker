"use client";

import { coursesAtom } from "@/app/dashboard/(store)/store";
import { ReadonlyURLSearchParams } from "next/navigation";
import { Course } from "@/app/dashboard/page";
import { scheduleAtoms } from "./atoms";
import { ScheduleGrid } from "./types";
import { atom } from "jotai";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

const PARAM_NAME = "schedule";

/**
 * V1: [semesterIndex, periodIndex, blockIndex, courseIndex]
 */
type ScheduleEntryV1 = [number, number, number, number];

/**
 * V2: [semesterIndex, periodIndex, blockIndex, courseCode]
 */
type ScheduleEntryV2 = [number, number, number, string];

interface SchedulePayloadV1 {
  v: undefined; // V1 has no version field
  s: number[];
  d: ScheduleEntryV1[];
}

interface SchedulePayloadV2 {
  v: "v2";
  s: number[];
  d: ScheduleEntryV2[];
}

type SchedulePayload = SchedulePayloadV1 | SchedulePayloadV2;

export const DEFAULT_GRID: ScheduleGrid = Array.from({ length: 10 }, () =>
  Array.from({ length: 2 }, () => Array.from({ length: 4 }, () => null)),
);

export const serializeSchedule = (
  courses: Record<string, Course>,
  grid: ScheduleGrid = DEFAULT_GRID,
): string | null => {
  if (!grid.length || Object.keys(courses).length === 0) return null;

  const entries: ScheduleEntryV2[] = [];
  const semesterBlockCounts: number[] = grid.map(
    (semester) => semester[0]?.length || 0,
  );

  grid.forEach((semester, sIdx) =>
    semester.forEach((period, pIdx) =>
      period.forEach((block, bIdx) => {
        if (block?.code && courses[block.code]) {
          // V2 uses the actual course code string
          entries.push([sIdx, pIdx, bIdx, block.code]);
        }
      }),
    ),
  );

  const payload: SchedulePayloadV2 = {
    v: "v2",
    s: semesterBlockCounts,
    d: entries,
  };

  return compressToEncodedURIComponent(JSON.stringify(payload));
};

interface WriteScheduleToUrlAtomArgs {
  searchParams: ReadonlyURLSearchParams;
  setSearchParam: (name: string, value: string | null) => void;
}

export const writeScheduleToUrlAtom = atom(
  null,
  (get, _set, { searchParams, setSearchParam }: WriteScheduleToUrlAtomArgs) => {
    const courses = get(coursesAtom);
    const grid = get(scheduleAtoms.schedulesAtom);

    const compressed = serializeSchedule(courses, grid);

    if (searchParams.get(PARAM_NAME) !== compressed) {
      setSearchParam(PARAM_NAME, compressed);
    }
  },
);

interface ReadScheduleToUrlAtomArgs {
  searchParams: ReadonlyURLSearchParams;
}

export const readScheduleFromUrlAtom = atom(
  null,
  (get, set, { searchParams }: ReadScheduleToUrlAtomArgs) => {
    const param = searchParams.get(PARAM_NAME);
    const courses = get(coursesAtom);

    // We only need the sorted keys for V1 migration
    const courseKeys = Object.keys(courses).sort();

    if (!param || Object.keys(courses).length === 0) return;

    try {
      const decompressed = decompressFromEncodedURIComponent(param);
      if (!decompressed) return;

      const payload = JSON.parse(decompressed) as SchedulePayload;
      const { s: semesterBlockCounts, d: entries } = payload;

      // Reconstruct the grid structure
      const newGrid: ScheduleGrid = semesterBlockCounts.map((blockCount) => [
        Array.from({ length: blockCount }, () => null),
        Array.from({ length: blockCount }, () => null),
      ]);

      entries.forEach((entry) => {
        const [sIdx, pIdx, bIdx, codeOrIdx] = entry;
        let courseCode: string | undefined;

        if (payload.v === "v2") {
          // V2: codeOrIdx is the string code
          courseCode = codeOrIdx as string;
        } else {
          // V1 Migration: codeOrIdx is the number index from sorted keys
          courseCode = courseKeys[codeOrIdx as number];
        }

        if (courseCode && courses[courseCode] && newGrid[sIdx]?.[pIdx]) {
          newGrid[sIdx][pIdx][bIdx] = courses[courseCode];
        }
      });

      set(scheduleAtoms.schedulesAtom, newGrid);
    } catch (e) {
      console.error("Failed to restore schedule from URL payload", e);
    }
  },
);
