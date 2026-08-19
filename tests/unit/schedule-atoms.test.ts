import { describe, expect, it } from "vitest";
import { createStore } from "jotai";
import {
  addBlockToSemesterAtom,
  addCourseAtom,
  deleteBlockFromSemesterAtom,
  periodAtom,
  resetScheduleAtom,
  scheduledCourseCodesAtom,
  selectedCoursesAtom,
  slotAtom,
} from "@/features/dashboard/state/schedule/atoms";
import {
  clearDragAtom,
  currentDropTargetIdAtom,
  draggedCourseAtom,
  setCompatibleDragSemestersAtom,
  setCurrentDropTargetIdAtom,
  setDraggedCourseAtom,
  setValidDropTargetIdsAtom,
  validDropTargetIdsAtom,
  compatibleDragSemestersAtom,
  compatibleTargetCountAtom,
  isCourseBeingDraggedAtom,
  isCurrentDropTargetAtom,
  isValidDropTargetAtom,
} from "@/features/dashboard/state/drag/atoms";
import type { Course, CourseOccasion } from "@/common/types";

const course = { code: "TST100" } as Course;
const occasion = {
  year: 2026,
  semester: "HT",
  periods: [{ period: 1, blocks: [1] }],
} as unknown as CourseOccasion;

describe("schedule action atoms", () => {
  it("updates only the addressed schedule slice", () => {
    const store = createStore();

    store.set(addCourseAtom, {
      course,
      occasion,
      semesterIndex: 0,
    });

    expect(store.get(slotAtom(0, 0, 0))).toBe(course);
    expect(store.get(slotAtom(1, 0, 0))).toBeNull();
    expect(store.get(selectedCoursesAtom)).toEqual([course]);
    expect(store.get(scheduledCourseCodesAtom)).toEqual(
      new Set([course.code]),
    );
  });

  it("does not notify an unrelated slot subscriber", () => {
    const store = createStore();
    let notifications = 0;
    const unsubscribe = store.sub(slotAtom(1, 0, 0), () => {
      notifications += 1;
    });

    store.set(addCourseAtom, { course, occasion, semesterIndex: 0 });

    expect(notifications).toBe(0);
    unsubscribe();
  });

  it("keeps period block counts aligned and resets schedule and drag state independently", () => {
    const store = createStore();

    store.set(addBlockToSemesterAtom, 0);
    expect(store.get(periodAtom(0, 0))).toHaveLength(5);
    expect(store.get(periodAtom(0, 1))).toHaveLength(5);

    store.set(deleteBlockFromSemesterAtom, {
      semester: 0,
      blockIndex: 4,
    });
    store.set(setDraggedCourseAtom, course);
    store.set(setValidDropTargetIdsAtom, new Set(["block-0-0-0"]));
    store.set(setCurrentDropTargetIdAtom, "block-0-0-0");
    store.set(setCompatibleDragSemestersAtom, [
      { semesterNumber: 0, targetCount: 1 },
    ]);
    store.set(resetScheduleAtom);
    store.set(clearDragAtom);

    expect(store.get(periodAtom(0, 0))).toHaveLength(4);
    expect(store.get(draggedCourseAtom)).toBeNull();
    expect(store.get(validDropTargetIdsAtom)).toEqual(new Set());
    expect(store.get(currentDropTargetIdAtom)).toBeNull();
    expect(store.get(compatibleDragSemestersAtom)).toEqual([]);
  });
});

describe("granular drag selectors", () => {
  it("does not notify unrelated drop targets", () => {
    const store = createStore();
    let validNotifications = 0;
    let currentNotifications = 0;
    const unsubscribeValid = store.sub(isValidDropTargetAtom("target-a"), () => {
      validNotifications += 1;
    });
    const unsubscribeCurrent = store.sub(
      isCurrentDropTargetAtom("target-a"),
      () => {
        currentNotifications += 1;
      },
    );

    store.set(setValidDropTargetIdsAtom, new Set(["target-b"]));
    store.set(setCurrentDropTargetIdAtom, "target-b");

    expect(validNotifications).toBe(0);
    expect(currentNotifications).toBe(0);
    unsubscribeValid();
    unsubscribeCurrent();
  });

  it("notifies only the affected course and semester summaries", () => {
    const store = createStore();
    let courseNotifications = 0;
    let semesterNotifications = 0;
    const unsubscribeCourse = store.sub(
      isCourseBeingDraggedAtom("OTHER100"),
      () => {
        courseNotifications += 1;
      },
    );
    const unsubscribeSemester = store.sub(
      compatibleTargetCountAtom(1),
      () => {
        semesterNotifications += 1;
      },
    );

    store.set(setDraggedCourseAtom, course);
    store.set(setCompatibleDragSemestersAtom, [
      { semesterNumber: 0, targetCount: 2 },
    ]);

    expect(courseNotifications).toBe(0);
    expect(semesterNotifications).toBe(0);
    unsubscribeCourse();
    unsubscribeSemester();
  });
});
