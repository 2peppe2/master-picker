import { locationAtom } from "../locationAtom";
import { coursesAtom } from "../coursesAtom";
import { scheduleAtoms } from "./atoms";
import { ScheduleGrid } from "./types";
import { atom } from "jotai";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

export type SyncAction = "WRITE" | "READ";

export const scheduleSyncEffect = atom(
  null,
  (get, set, action: "WRITE" | "READ") => {
    const courses = get(coursesAtom);
    const courseKeys = Object.keys(courses).sort();

    if (action === "WRITE") {
      const grid = get(scheduleAtoms.schedulesAtom);
      if (!grid.length) return;

      // Hämta aktuella dimensioner
      const layers = grid.length;
      const rows = grid[0].length;
      const cols = grid[0][0].length;

      const entries: [number, number, number, number][] = [];

      // Vi sparar koordinaterna explicit [L, R, C, CourseIdx]
      // för att vara helt säkra på position oavsett grid-storlek
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

      // Paketet innehåller nu [Dimensioner, Data]
      const payload = {
        dims: [layers, rows, cols],
        data: entries,
      };

      const compressed = compressToEncodedURIComponent(JSON.stringify(payload));

      set(locationAtom, (prev) => {
        const p = new URLSearchParams(prev.searchParams);
        if (p.get("v") !== compressed) {
          p.set("v", compressed);
          return { ...prev, searchParams: p };
        }
        return prev;
      });
    }

    if (action === "READ") {
      const loc = get(locationAtom);
      const v = loc.searchParams?.get("v");

      if (!v || courseKeys.length === 0) return;

      try {
        const decompressed = decompressFromEncodedURIComponent(v);
        if (!decompressed) return;

        const payload = JSON.parse(decompressed);
        const [layers, rows, cols] = payload.dims;
        const entries = payload.data as [number, number, number, number][];

        // 1. Skapa en ny grid med DE SPARADE dimensionerna
        const newGrid: ScheduleGrid = Array.from({ length: layers }, () =>
          Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => null),
          ),
        );

        // 2. Placera ut kurserna
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
    }
  },
);
