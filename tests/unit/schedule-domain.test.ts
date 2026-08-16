import { describe, expect, it } from "vitest";
import {
  placeCourse,
  removeCourseFromGrid,
} from "@/features/dashboard/state/schedule/domain";
import { ScheduleGrid } from "@/features/dashboard/state/schedule/types";
import { Course, CourseOccasion } from "@/common/types";

const course = { code: "TEST101" } as Course;

const grid = (): ScheduleGrid => [
  [
    [null, null, null, null],
    [null, null, null, null],
  ],
];

describe("placeCourse", () => {
  it("places a scheduled course in every specified block", () => {
    const occasion = {
      periods: [{ period: 1, blocks: [1, 3] }],
    } as unknown as CourseOccasion;

    const result = placeCourse({ course, grid: grid(), occasion, semesterIndex: 0 });

    expect(result[0][0]).toEqual([course, null, course, null]);
  });

  it("uses a vacant wildcard block before extending the semester", () => {
    const occasion = {
      periods: [{ period: 2, blocks: [] }],
    } as unknown as CourseOccasion;
    const initial = grid();
    initial[0][1].push(null);

    const result = placeCourse({ course, grid: initial, occasion, semesterIndex: 0 });

    expect(result[0][1][4]).toBe(course);
    expect(result[0][0]).toHaveLength(4);
  });

  it("extends every period together when wildcard capacity is full", () => {
    const occasion = {
      periods: [{ period: 1, blocks: [] }],
    } as unknown as CourseOccasion;
    const initial = grid();
    initial[0][0].push({ code: "OTHER" } as Course);
    initial[0][1].push({ code: "OTHER" } as Course);

    const result = placeCourse({ course, grid: initial, occasion, semesterIndex: 0 });

    expect(result[0][0][5]).toBe(course);
    expect(result[0][1][5]).toBeNull();
  });

  it("does not mutate a grid when the target semester is missing", () => {
    const initial = grid();
    const occasion = {
      periods: [{ period: 1, blocks: [1] }],
    } as unknown as CourseOccasion;

    expect(
      placeCourse({ course, grid: initial, occasion, semesterIndex: 1 }),
    ).toEqual(initial);
  });

  it("removes every placement of a course without changing other courses", () => {
    const otherCourse = { code: "OTHER" } as Course;
    const initial = grid();
    initial[0][0] = [course, otherCourse, course, null];

    expect(removeCourseFromGrid(initial, course.code)[0][0]).toEqual([
      null,
      otherCourse,
      null,
      null,
    ]);
  });
});
