import { describe, expect, it } from "vitest";
import {
  getExpectedExamMonths,
  resolveOriginalMonths,
} from "@/common/components/CourseDialog/tabs/examination/hooks/useLatestOriginalStats";

const session = (date: string, quantity: number) => ({
  date,
  grades: [{ grade: "3", quantity, gradeOrder: 3 }],
});

/** TAMS43: listed as HT period 1 (→ October) but examined in January. */
const tams43 = [
  session("2026-01-17T00:00:00Z", 2),
  session("2025-08-22T00:00:00Z", 2),
  session("2025-03-17T00:00:00Z", 2),
  session("2025-01-13T00:00:00Z", 8),
  session("2024-08-23T00:00:00Z", 1),
  session("2024-03-12T00:00:00Z", 8),
  session("2024-01-08T00:00:00Z", 24),
];

describe("resolveOriginalMonths", () => {
  it("falls back to the busiest month when no sitting matches the expected months", () => {
    // HT period 1 maps to October, which TAMS43 never sits.
    expect(resolveOriginalMonths(tams43, new Set([9]))).toEqual(new Set([0]));
  });

  it("marks every January sitting original for TAMS43, and nothing else", () => {
    const originalMonths = resolveOriginalMonths(tams43, new Set([9]));
    const originalDates = tams43
      .filter((m) => originalMonths.has(new Date(m.date).getMonth()))
      .map((m) => m.date.slice(0, 10));

    expect(originalDates).toEqual(["2026-01-17", "2025-01-13", "2024-01-08"]);
  });

  it("keeps the expected months when at least one sitting matches", () => {
    const sessions = [
      session("2025-10-24T00:00:00Z", 30),
      session("2025-03-17T00:00:00Z", 40),
    ];

    // March has more students, but October is a genuine match and wins.
    expect(resolveOriginalMonths(sessions, new Set([9]))).toEqual(new Set([9]));
  });

  it("keeps a multi-month expected set when one of its months matches", () => {
    const sessions = [
      session("2025-06-02T00:00:00Z", 20),
      session("2025-08-22T00:00:00Z", 3),
    ];

    // VT period 2 → May + June; the June sitting validates the whole set.
    expect(resolveOriginalMonths(sessions, new Set([4, 5]))).toEqual(
      new Set([4, 5]),
    );
  });

  it("uses the student-count heuristic when there is no occasion data", () => {
    expect(resolveOriginalMonths(tams43)).toEqual(new Set([0]));
    expect(resolveOriginalMonths(tams43, new Set())).toEqual(new Set([0]));
  });

  it("returns an empty set for a module with no sittings", () => {
    expect(resolveOriginalMonths([], new Set([9]))).toEqual(new Set());
    expect(resolveOriginalMonths([])).toEqual(new Set());
  });
});

describe("getExpectedExamMonths", () => {
  it("maps the last period of each occasion to its exam month", () => {
    expect(
      getExpectedExamMonths([
        { semester: "HT", periods: [{ period: 1 }] },
        { semester: "HT", periods: [{ period: 1 }, { period: 2 }] },
        { semester: "VT", periods: [{ period: 1 }] },
        { semester: "VT", periods: [{ period: 2 }] },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any),
    ).toEqual(new Set([9, 0, 2, 4, 5]));
  });
});
