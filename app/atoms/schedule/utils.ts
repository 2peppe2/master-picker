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

type Entry = [number, number, number, number];

export const writeScheduleToUrlAtom = atom(
  null,
  (
    get,
    _set,
    args: {
      searchParams: ReadonlyURLSearchParams;
      setSearchParam: (name: string, value: string | null) => void;
    },
  ) => {
    const { searchParams, setSearchParam } = args;
    const courses = get(coursesAtom);
    const grid = get(scheduleAtoms.schedulesAtom);

    if (!grid.length || Object.keys(courses).length === 0) return;

    const courseKeys = Object.keys(courses).sort();
    const entries: Entry[] = [];

    grid.forEach((layer, l) =>
      layer.forEach((row, r) =>
        row.forEach((col, c) => {
          if (col?.code) {
            const courseIdx = courseKeys.indexOf(col.code);
            if (courseIdx !== -1) entries.push([l, r, c, courseIdx]);
          }
        }),
      ),
    );

    const payload = {
      dims: [grid.length, grid[0].length, grid[0][0].length],
      data: entries,
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

      const payload = JSON.parse(decompressed);
      const [layers, rows, cols] = payload.dims;
      const entries = payload.data as Entry[];

      const newGrid: ScheduleGrid = Array.from({ length: layers }, () =>
        Array.from({ length: rows }, () =>
          Array.from({ length: cols }, () => null),
        ),
      );

      entries.forEach(([l, r, c, courseIdx]) => {
        const code = courseKeys[courseIdx];
        if (code && courses[code]) {
          newGrid[l][r][c] = courses[code];
        }
      });

      set(scheduleAtoms.schedulesAtom, newGrid);
    } catch (e) {
      console.error("Failed to restore grid dimensions from URL", e);
    }
  },
);
