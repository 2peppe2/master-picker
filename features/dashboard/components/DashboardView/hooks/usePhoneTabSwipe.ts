"use client";

import { useIsCompact } from "@/common/hooks/useResponsiveLayout";
import {
  useHorizontalSwipe,
  type HorizontalSwipeBindings,
} from "@/common/hooks/useHorizontalSwipe";
import type { DashboardTab } from "..";

const SWIPE_EXCLUSION_SELECTOR = [
  '[aria-modal="true"]',
  '[role="dialog"]',
  '[data-no-swipe="true"]',
  '[data-slot="alert-dialog-content"]',
  '[data-slot="dialog-content"]',
  '[data-slot="popover-content"]',
  '[data-slot="select-content"]',
  '[data-slot="sheet-content"]',
  '[data-slot$="-overlay"]',
].join(",");

interface UsePhoneTabSwipeArgs {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

export const usePhoneTabSwipe = ({
  activeTab,
  setActiveTab,
}: UsePhoneTabSwipeArgs): HorizontalSwipeBindings => {
  const isCompact = useIsCompact();

  return useHorizontalSwipe({
    enabled: isCompact,
    exclusionSelector: SWIPE_EXCLUSION_SELECTOR,
    onSwipe: (direction) => {
      let nextTab: DashboardTab | null = null;
      if (direction === "left" && activeTab === "schedule") {
        nextTab = "search";
      }

      if (direction === "right" && activeTab === "search") {
        nextTab = "schedule";
      }

      if (!nextTab) return false;
      setActiveTab(nextTab);
      return true;
    },
  });
};
