import { describe, expect, it } from "vitest";
import {
  readLandingQuery,
  updateLandingQuery,
} from "@/common/navigation/queryState";

describe("landing query state", () => {
  it("uses URL values as the complete landing selection state", () => {
    const query = readLandingQuery(
      new URLSearchParams("program=CS&year=2026&master=AI"),
    );

    expect(query).toEqual({ program: "CS", year: "2026", master: "AI" });
  });

  it("returns null for omitted selections", () => {
    expect(readLandingQuery(new URLSearchParams())).toEqual({
      program: null,
      year: null,
      master: null,
    });
  });

  it("updates selection values without discarding unrelated query parameters", () => {
    const query = updateLandingQuery(
      new URLSearchParams("lang=en&program=CS&year=2025&master=AI"),
      {
        program: "IT",
        year: null,
        master: null,
      },
    );

    expect(query.toString()).toBe("lang=en&program=IT");
  });

  it("can update only the selected master", () => {
    const query = updateLandingQuery(
      new URLSearchParams("lang=sv&program=CS&year=2025"),
      { master: "DS" },
    );

    expect(readLandingQuery(query)).toEqual({
      program: "CS",
      year: "2025",
      master: "DS",
    });
  });
});
