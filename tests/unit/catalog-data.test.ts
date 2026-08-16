import { describe, expect, it } from "vitest";
import type { Course } from "@/common/types";
import {
  courseListAtom,
  coursesAtom,
} from "@/features/dashboard/state/catalog-data/atoms";
import { createStore } from "jotai";

describe("dashboard catalog data", () => {
  it("derives the course list from the hydrated course record", () => {
    const store = createStore();
    const firstCourse = { code: "AAA100" } as Course;
    const secondCourse = { code: "BBB200" } as Course;

    store.set(coursesAtom, {
      [firstCourse.code]: firstCourse,
      [secondCourse.code]: secondCourse,
    });

    expect(store.get(courseListAtom)).toEqual([firstCourse, secondCourse]);
  });
});
