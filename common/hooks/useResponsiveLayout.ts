"use client";

import { useMediaQuery } from "react-responsive";

export const PHONE_MAX_WIDTH = 639;
export const COMPACT_MAX_WIDTH = 1023;
export const SHORT_VIEWPORT_MAX_HEIGHT = 500;

export const PHONE_QUERY = `(max-width: ${PHONE_MAX_WIDTH}px)`;
export const COMPACT_QUERY = `(max-width: ${COMPACT_MAX_WIDTH}px)`;
export const SHORT_VIEWPORT_QUERY = `(max-height: ${SHORT_VIEWPORT_MAX_HEIGHT}px)`;
export const SHORT_LANDSCAPE_QUERY = `${SHORT_VIEWPORT_QUERY} and (orientation: landscape)`;

export type LayoutTier = "phone" | "tablet" | "desktop";

export interface LayoutSignals {
  /** Matches PHONE_QUERY. */
  isNarrow: boolean;
  /** Matches COMPACT_QUERY. */
  isCompactWidth: boolean;
  /** Matches SHORT_LANDSCAPE_QUERY. */
  isShortLandscape: boolean;
}

/**
 * Resolves the layout tier from raw media-query signals.
 *
 * A rotated phone is wide enough to look like a tablet, so a short landscape
 * viewport is treated as a phone regardless of its width.
 */
export const resolveLayoutTier = ({
  isNarrow,
  isCompactWidth,
  isShortLandscape,
}: LayoutSignals): LayoutTier => {
  if (isNarrow || isShortLandscape) return "phone";

  return isCompactWidth ? "tablet" : "desktop";
};

/** Reports which of the three mutually exclusive layout tiers is active. */
export const useLayoutTier = (): LayoutTier =>
  resolveLayoutTier({
    isNarrow: useMediaQuery({ query: PHONE_QUERY }),
    isCompactWidth: useMediaQuery({ query: COMPACT_QUERY }),
    isShortLandscape: useMediaQuery({ query: SHORT_LANDSCAPE_QUERY }),
  });

/** Reports whether the viewport uses the phone layout. */
export const useIsPhone = () => useLayoutTier() === "phone";

/** Reports whether the viewport is within the tablet breakpoint. */
export const useIsTablet = () => useLayoutTier() === "tablet";

/** Reports whether the dashboard uses its compact layout. */
export const useIsCompact = () => useLayoutTier() !== "desktop";

/** Reports whether the viewport is a phone held in landscape. */
export const useIsLandscapePhone = () =>
  useMediaQuery({ query: SHORT_LANDSCAPE_QUERY });

/** Reports whether the viewport is too short for percentage-height overlays. */
export const useIsShortViewport = () =>
  useMediaQuery({ query: SHORT_VIEWPORT_QUERY });

/**
 * Chooses between a bottom sheet and a centred dialog.
 *
 * A sheet needs portrait height to be worth its chrome: on a landscape phone it
 * covers the whole viewport and still leaves the content a couple of hundred
 * pixels. Those phones get the dialog, which is already sized for a short, wide
 * viewport, so prefer this over useIsPhone wherever the two shells differ only
 * in that choice.
 */
export const usePrefersSheet = () => {
  const isPhone = useIsPhone();
  const isLandscapePhone = useIsLandscapePhone();

  return isPhone && !isLandscapePhone;
};

/**
 * Reports whether the viewport is driven by touch rather than a mouse.
 *
 * Distinct from useIsPhone-as-a-width-check: a landscape phone is 667-932px
 * wide, so a `sm:` breakpoint reads it as a desktop and hands it hover-only
 * affordances it can never trigger. Anything picking between a hover and a tap
 * interaction must branch on this.
 */
export const useIsTouchLayout = () => useIsPhone();
