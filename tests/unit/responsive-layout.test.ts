import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  ANY_COARSE_POINTER_QUERY,
  COMPACT_MAX_WIDTH,
  PHONE_MAX_WIDTH,
  SHORT_VIEWPORT_MAX_HEIGHT,
  prefersTapDisclosure,
  resolveLayoutTier,
  type LayoutTier,
} from "@/common/hooks/useResponsiveLayout";

/** Mirrors what the media queries in useResponsiveLayout would match. */
const tierFor = (width: number, height: number): LayoutTier =>
  resolveLayoutTier({
    isNarrow: width <= PHONE_MAX_WIDTH,
    isCompactWidth: width <= COMPACT_MAX_WIDTH,
    isShortLandscape: height <= SHORT_VIEWPORT_MAX_HEIGHT && width > height,
  });

const devices: [string, number, number, LayoutTier][] = [
  ["iPhone 13 portrait", 390, 844, "phone"],
  ["iPhone 13 landscape", 844, 390, "phone"],
  ["Pixel 7 portrait", 412, 915, "phone"],
  ["Pixel 7 landscape", 915, 412, "phone"],
  ["iPad portrait", 768, 1024, "tablet"],
  ["iPad landscape", 1024, 768, "desktop"],
  ["desktop", 1920, 1080, "desktop"],
];

describe("resolveLayoutTier", () => {
  it.each(devices)("classifies %s as %s", (_name, width, height, expected) => {
    expect(tierFor(width, height)).toBe(expected);
  });

  it("keeps a rotated phone on the phone tier despite its tablet width", () => {
    expect(tierFor(844, 390)).toBe(tierFor(390, 844));
  });

  it("does not demote a tall tablet-width viewport", () => {
    expect(tierFor(900, 1200)).toBe("tablet");
  });

  it("ignores height on a square viewport, which is not landscape", () => {
    expect(tierFor(800, 800)).toBe("tablet");
  });

  it("treats any short landscape window as a phone, touch or not", () => {
    // Documented trade-off: shape decides the tier, pointer type does not.
    expect(tierFor(1200, 400)).toBe("phone");
  });

  it("yields exactly one tier per viewport", () => {
    for (const [, width, height] of devices) {
      const tier = tierFor(width, height);
      const isPhone = tier === "phone";
      const isTablet = tier === "tablet";
      const isCompact = tier !== "desktop";

      expect(isPhone && isTablet).toBe(false);
      expect(isCompact).toBe(isPhone || isTablet);
    }
  });
});

describe("prefersTapDisclosure", () => {
  const forDevice = ({
    isPhone = false,
    touch = false,
    anyCoarse = touch,
  }: {
    isPhone?: boolean;
    touch?: boolean;
    anyCoarse?: boolean;
  } = {}) =>
    prefersTapDisclosure({
      isPhone,
      hasTouchPoints: touch,
      hasAnyCoarsePointer: anyCoarse,
    });

  it("asks about touch capability rather than viewport width", () => {
    expect(ANY_COARSE_POINTER_QUERY).toBe("(any-pointer: coarse)");
    expect(ANY_COARSE_POINTER_QUERY).not.toContain("width");
  });

  it("uses tap disclosure whenever the browser reports touch points", () => {
    expect(forDevice({ touch: true })).toBe(true);
  });

  it("keeps tap disclosure when a fine primary pointer is attached", () => {
    expect(forDevice({ touch: true, anyCoarse: false })).toBe(true);
  });

  it("uses any coarse pointer as a fallback", () => {
    expect(forDevice({ anyCoarse: true })).toBe(true);
  });

  it("keeps phones tap-driven before capability signals hydrate", () => {
    expect(forDevice({ isPhone: true })).toBe(true);
  });

  it("leaves mouse-only viewports on hover", () => {
    expect(forDevice()).toBe(false);
  });
});

/*
 * The landscape density rules live in CSS, which cannot import the constant
 * above. These assert the two stay in step rather than drifting silently.
 */
describe("landscape density stylesheet", () => {
  const globals = readFileSync(
    new URL("../../app/globals.css", import.meta.url),
    "utf8",
  );

  it("scopes its media query to SHORT_VIEWPORT_MAX_HEIGHT", () => {
    expect(globals).toContain(
      `@media (max-height: ${SHORT_VIEWPORT_MAX_HEIGHT}px) and (orientation: landscape)`,
    );
  });

  it("declares the landscape-phone variant at the same height", () => {
    expect(globals).toContain(
      `@custom-variant landscape-phone (@media (max-height: ${SHORT_VIEWPORT_MAX_HEIGHT}px) and (orientation: landscape));`,
    );
  });

  it("keeps touch targets off the --spacing scale", () => {
    // --spacing is isotropic, so anything sized from it shrinks with layout.
    const touchTokens = globals.match(/--touch(-sm)?:[^;]+;/g) ?? [];

    expect(touchTokens.length).toBeGreaterThan(0);
    for (const token of touchTokens) {
      expect(token).toMatch(/rem;$/);
      expect(token).not.toContain("--spacing");
    }
  });
});
