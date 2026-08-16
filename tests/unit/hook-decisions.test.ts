import { describe, expect, it } from "vitest";
import { getSwipeDirection } from "@/common/hooks/useHorizontalSwipe";
import {
  getCurrentTermScrollTarget,
  isScrollTargetReachable,
} from "@/features/dashboard/components/Schedule/hooks/useCurrentTermPosition";
import {
  getCompatibleHoveredSemester,
  shouldAutoOpenSemester,
} from "@/features/dashboard/components/Schedule/hooks/useDragSemesterAutoExpand";
import {
  shouldHydrateScheduleFromUrl,
  shouldWriteScheduleToUrl,
} from "@/features/dashboard/components/ScheduleSync/hooks/useScheduleUrlSync";

describe("hook decision helpers", () => {
  it("calculates a sticky-header-aware current-term scroll target", () => {
    expect(
      getCurrentTermScrollTarget({
        currentScrollTop: 200,
        semesterTop: 500,
        scrollContainerTop: 100,
        stickyHeaderHeight: 80,
      }),
    ).toBe(504);
    expect(
      getCurrentTermScrollTarget({
        currentScrollTop: 0,
        semesterTop: 20,
        scrollContainerTop: 0,
        stickyHeaderHeight: 80,
      }),
    ).toBe(0);
  });

  it("recognizes reachable scroll targets", () => {
    expect(
      isScrollTargetReachable({
        scrollHeight: 1_000,
        clientHeight: 400,
        targetScrollTop: 600,
      }),
    ).toBe(true);
    expect(
      isScrollTargetReachable({
        scrollHeight: 1_000,
        clientHeight: 400,
        targetScrollTop: 601,
      }),
    ).toBe(false);
  });

  it("classifies only dominant horizontal swipes", () => {
    expect(getSwipeDirection({ deltaX: -60, deltaY: 10 })).toBe("left");
    expect(getSwipeDirection({ deltaX: 60, deltaY: 10 })).toBe("right");
    expect(getSwipeDirection({ deltaX: 47, deltaY: 0 })).toBeNull();
    expect(getSwipeDirection({ deltaX: 60, deltaY: 55 })).toBeNull();
  });

  it("selects compatible semesters for auto-expansion", () => {
    const compatibleSemesters = new Set([1, 3]);

    expect(getCompatibleHoveredSemester(3, compatibleSemesters)).toBe(3);
    expect(getCompatibleHoveredSemester(2, compatibleSemesters)).toBeNull();
    expect(shouldAutoOpenSemester(3, [1, 2, 3])).toBe(true);
    expect(shouldAutoOpenSemester(3, [1, 2, 3, 4])).toBe(false);
  });

  it("avoids schedule URL hydration and writes that would loop", () => {
    expect(
      shouldHydrateScheduleFromUrl({
        courseCount: 1,
        scheduleFromUrl: "encoded",
        lastWrittenSchedule: undefined,
      }),
    ).toBe(true);
    expect(
      shouldHydrateScheduleFromUrl({
        courseCount: 0,
        scheduleFromUrl: "encoded",
        lastWrittenSchedule: undefined,
      }),
    ).toBe(false);
    expect(
      shouldWriteScheduleToUrl("encoded", "encoded"),
    ).toBe(false);
    expect(shouldWriteScheduleToUrl(null, "encoded")).toBe(true);
  });
});
