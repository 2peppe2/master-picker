"use client";

import {
  useHorizontalSwipe,
  type HorizontalSwipeBindings,
} from "@/common/hooks/useHorizontalSwipe";

const SWIPE_EXCLUSION_SELECTOR = '[data-no-swipe="true"]';

interface UseCourseTabSwipeArgs {
  enabled: boolean;
  tabValues: string[];
  value?: string;
  onValueChange?: (value: string) => void;
}

/** Maps phone swipes to adjacent visible course-dialog tabs. */
export const useCourseTabSwipe = ({
  enabled,
  tabValues,
  value,
  onValueChange,
}: UseCourseTabSwipeArgs): HorizontalSwipeBindings => {
  return useHorizontalSwipe({
    enabled,
    exclusionSelector: SWIPE_EXCLUSION_SELECTOR,
    onSwipe: (direction) => {
      const currentIndex = value ? tabValues.indexOf(value) : 0;
      if (currentIndex < 0) return false;

      const nextIndex =
        direction === "left" ? currentIndex + 1 : currentIndex - 1;
      const nextValue = tabValues[nextIndex];
      if (!nextValue) return false;

      onValueChange?.(nextValue);
      return true;
    },
  });
};
