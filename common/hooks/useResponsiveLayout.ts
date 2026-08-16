"use client";

import { useMediaQuery } from "react-responsive";

export const PHONE_MAX_WIDTH = 639;
export const COMPACT_MAX_WIDTH = 1023;

export const PHONE_QUERY = `(max-width: ${PHONE_MAX_WIDTH}px)`;
export const COMPACT_QUERY = `(max-width: ${COMPACT_MAX_WIDTH}px)`;
export const TABLET_QUERY = `(min-width: ${
  PHONE_MAX_WIDTH + 1
}px) and (max-width: ${COMPACT_MAX_WIDTH}px)`;

/** Reports whether the viewport uses the phone layout. */
export const useIsPhone = () => useMediaQuery({ query: PHONE_QUERY });

/** Reports whether the dashboard uses its compact layout. */
export const useIsCompact = () => useMediaQuery({ query: COMPACT_QUERY });

/** Reports whether the viewport is within the tablet breakpoint. */
export const useIsTablet = () => useMediaQuery({ query: TABLET_QUERY });
