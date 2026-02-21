import { locationAtom } from "../locationAtom";
import { Course } from "@/app/dashboard/page";
import { coursesAtom } from "../coursesAtom";
import { atom, Getter, Setter } from "jotai";
import { scheduleAtoms } from "./atoms";
import { ScheduleGrid } from "./types";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

export type SyncAction = "WRITE" | "READ";

const PARAM_NAME = "schedule";

type Entry = [number, number, number, number];

export const scheduleSyncEffectAtom = atom(
  null,
  (get, set, action: "WRITE" | "READ") => {
    const params = useSearchParams();

    const setSearchParams = (newParams: URLSearchParams) => {
      

    const courses = get(coursesAtom);
    const courseKeys = Object.keys(courses).sort();

    if (action === "WRITE") {
      performWrite({ set, get, params, courseKeys });
    }

    if (action === "READ") {
      performRead({ set, params, courses, courseKeys });
    }
  },
);

interface PerformWriteSyncArgs {
  get: Getter;
  set: Setter;
  courseKeys: string[];
  params: ReadonlyURLSearchParams;
}

const performWrite = ({ get, set, params, courseKeys }: PerformWriteSyncArgs) => {
  const grid = get(scheduleAtoms.schedulesAtom);
  if (!grid.length) return;

  const layers = grid.length;
  const rows = grid[0].length;
  const cols = grid[0][0].length;

  const entries: Entry[] = [];

  grid.forEach((layer, l) =>
    layer.forEach((row, r) =>
      row.forEach((col, c) => {
        if (col?.code) {
          const courseIdx = courseKeys.indexOf(col.code);
          if (courseIdx !== -1) {
            entries.push([l, r, c, courseIdx]);
          }
        }
      }),
    ),
  );

  const payload = {
    dims: [layers, rows, cols],
    data: entries,
  };

  const compressed = compressToEncodedURIComponent(JSON.stringify(payload));
  

  set(locationAtom, (prev) => {
    console.log(prev);
    const p = new URLSearchParams(prev.searchParams);
    if (p.get(PARAM_NAME) !== compressed) {
      p.set(PARAM_NAME, compressed);
      return { ...prev, searchParams: p };
    }
    return prev;
  });
};

interface PerformReadSyncArgs {
  set: Setter;
  courses: Record<string, Course>;
  courseKeys: string[];
  params: ReadonlyURLSearchParams;
}

const performRead = ({
  set,
  courses,
  courseKeys,
  params,
}: PerformReadSyncArgs) => {
  const param = params?.get(PARAM_NAME);

  if (!param || courseKeys.length === 0) return;

  try {
    const decompressed = decompressFromEncodedURIComponent(param);
    if (!decompressed) return;

    const payload = JSON.parse(decompressed);
    const [layers, rows, cols] = payload.dims;
    const entries = payload.data as [number, number, number, number][];

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
    console.error("Kunde inte återställa grid-dimensioner", e);
  }
};
