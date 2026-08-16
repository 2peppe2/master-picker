import { describe, expect, it } from "vitest";
import {
  deserializeSchedule,
  serializeSchedule,
} from "@/features/dashboard/state/schedule/utils";
import { Course } from "@/common/types";
import { compressToEncodedURIComponent } from "lz-string";

const courseA = { code: "AAA100" } as Course;
const courseB = { code: "BBB200" } as Course;
const courses = { [courseA.code]: courseA, [courseB.code]: courseB };

describe("schedule URL payloads", () => {
  it("round-trips v2 schedules by course code", () => {
    const encoded = serializeSchedule(courses, [
      [[courseA, null], [null, courseB]],
    ]);

    expect(deserializeSchedule(courses, encoded)).toEqual([
      [[courseA, null], [null, courseB]],
    ]);
  });

  it("restores legacy v1 schedules from sorted course indexes", () => {
    const encoded = compressToEncodedURIComponent(
      JSON.stringify({ s: [2], d: [[0, 1, 0, 1]] }),
    );

    expect(deserializeSchedule(courses, encoded)?.[0][1][0]).toBe(courseB);
  });

  it("ignores unknown courses and malformed payloads", () => {
    const unknownCourse = compressToEncodedURIComponent(
      JSON.stringify({ v: "v2", s: [1], d: [[0, 0, 0, "MISSING"]] }),
    );

    expect(deserializeSchedule(courses, unknownCourse)).toEqual([[[null], [null]]]);
    expect(deserializeSchedule(courses, "not-a-schedule")).toBeNull();
  });

  it("does not create a schedule query parameter for an empty grid", () => {
    expect(serializeSchedule(courses, [[[null], [null]]])).toBeNull();
  });
});
