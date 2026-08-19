import type { Page } from "@playwright/test";

import {
  COMPACT_MAX_WIDTH,
  PHONE_MAX_WIDTH,
  SHORT_VIEWPORT_MAX_HEIGHT,
  resolveLayoutTier,
  type LayoutTier,
} from "@/common/hooks/useResponsiveLayout";

/**
 * Mirrors the app's layout tier for the page's current viewport.
 *
 * Tests must not compare widths directly: a phone in landscape is wider than
 * the tablet breakpoint but still renders the phone layout.
 */
export const layoutTier = (page: Page): LayoutTier => {
  const viewport = page.viewportSize();

  if (!viewport) return "desktop";

  const { width, height } = viewport;

  return resolveLayoutTier({
    isNarrow: width <= PHONE_MAX_WIDTH,
    isCompactWidth: width <= COMPACT_MAX_WIDTH,
    isShortLandscape: height <= SHORT_VIEWPORT_MAX_HEIGHT && width > height,
  });
};

/** True when the dashboard renders its side-by-side landscape shell. */
export const isLandscapePhone = (page: Page): boolean => {
  const viewport = page.viewportSize();

  if (!viewport) return false;

  return (
    viewport.height <= SHORT_VIEWPORT_MAX_HEIGHT &&
    viewport.width > viewport.height
  );
};

/** True only for the full desktop shell with drag-and-drop. */
export const isDesktop = (page: Page): boolean =>
  layoutTier(page) === "desktop";

/**
 * Brings the search panel into view.
 *
 * Desktop and landscape phones show it permanently; the portrait compact
 * layout hides it behind a tab.
 */
export const revealSearchPanel = async (page: Page): Promise<void> => {
  const searchTab = page.locator("#dashboard-search-tab");

  if (await searchTab.isVisible()) await searchTab.click();
};
