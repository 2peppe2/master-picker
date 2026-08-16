"use client";

import { Course } from "@/common/types";
import { ScheduleGrid } from "./types";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

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

  if (entries.length === 0) return null;

  return compressToEncodedURIComponent(JSON.stringify(payload));
};

export const deserializeSchedule = (
  courses: Record<string, Course>,
  param: string | null,
): ScheduleGrid | null => {
  if (!param || Object.keys(courses).length === 0) return null;

  try {
    const decompressed = decompressFromEncodedURIComponent(param);
    if (!decompressed) return null;

    const payload = JSON.parse(decompressed) as SchedulePayload;
    if (
      !Array.isArray(payload.s) ||
      !Array.isArray(payload.d) ||
      !payload.s.every(
        (blockCount) => Number.isInteger(blockCount) && blockCount >= 0,
      )
    ) {
      return null;
    }

    const courseKeys = Object.keys(courses).sort();
    const grid: ScheduleGrid = payload.s.map((blockCount) => [
      Array.from({ length: blockCount }, () => null),
      Array.from({ length: blockCount }, () => null),
    ]);

    payload.d.forEach((entry) => {
      if (!Array.isArray(entry) || entry.length !== 4) return;

      const [semester, period, block, codeOrIndex] = entry;
      if (
        !Number.isInteger(semester) ||
        !Number.isInteger(period) ||
        !Number.isInteger(block)
      ) {
        return;
      }

      let courseCode: string | undefined;
      if (payload.v === "v2" && typeof codeOrIndex === "string") {
        courseCode = codeOrIndex;
      }

      if (payload.v !== "v2" && typeof codeOrIndex === "number") {
        courseCode = courseKeys[codeOrIndex];
      }

      if (courseCode && courses[courseCode] && grid[semester]?.[period]) {
        grid[semester][period][block] = courses[courseCode];
      }
    });

    return grid;
  } catch {
    return null;
  }
};
