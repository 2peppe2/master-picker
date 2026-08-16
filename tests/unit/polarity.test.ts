import { describe, expect, it } from "vitest";
import {
  encodeOptionValue,
  oppositeOptionValue,
  parseOptionValue,
} from "@/components/ui/MultiSelect/polarity";

describe("option value polarity", () => {
  it("encodes both polarities under the same prefix", () => {
    expect(encodeOptionValue("examination", "lab")).toBe("examination:lab");
    expect(encodeOptionValue("examination", "lab", { negated: true })).toBe(
      "examination:!lab",
    );
  });

  it("encodes numeric values", () => {
    expect(encodeOptionValue("semester", 7)).toBe("semester:7");
    expect(encodeOptionValue("semester", 7, { negated: true })).toBe(
      "semester:!7",
    );
  });

  it.each([
    ["master:AI", { prefix: "master", value: "AI", negated: false }],
    ["master:!AI", { prefix: "master", value: "AI", negated: true }],
    // Master names and search terms may contain the separator themselves.
    [
      "search:a:b",
      { prefix: "search", value: "a:b", negated: false },
    ],
    [
      "mainField:!Data: Science",
      { prefix: "mainField", value: "Data: Science", negated: true },
    ],
  ])("parses %s", (raw, expected) => {
    expect(parseOptionValue(raw)).toEqual(expected);
  });

  it("round-trips through encode and parse", () => {
    const raw = "mainField:!Data: Science";
    const { prefix, value, negated } = parseOptionValue(raw);

    expect(encodeOptionValue(prefix, value, { negated })).toBe(raw);
  });

  it("flips polarity both ways", () => {
    expect(oppositeOptionValue("level:A")).toBe("level:!A");
    expect(oppositeOptionValue("level:!A")).toBe("level:A");
    expect(oppositeOptionValue(oppositeOptionValue("level:A"))).toBe("level:A");
  });
});
