"use client";

import { useEffect, useRef } from "react";

const MAX_POSITION_ATTEMPTS = 30;
const POSITION_RETRY_DELAY_MS = 100;
const SCROLL_TOP_GUTTER_PX = 16;

interface CurrentTermPositionTarget {
  card: HTMLElement;
  scrollContainer: HTMLElement;
}

interface ScrollTargetArgs {
  currentScrollTop: number;
  semesterTop: number;
  scrollContainerTop: number;
  stickyHeaderHeight: number;
}

interface ScrollRangeArgs {
  scrollHeight: number;
  clientHeight: number;
  targetScrollTop: number;
}

export const getCurrentTermScrollTarget = ({
  currentScrollTop,
  semesterTop,
  scrollContainerTop,
  stickyHeaderHeight,
}: ScrollTargetArgs) => {
  const semesterOffsetInContainer = semesterTop - scrollContainerTop;
  const offsetBelowStickyHeader =
    semesterOffsetInContainer - stickyHeaderHeight - SCROLL_TOP_GUTTER_PX;

  return Math.max(0, currentScrollTop + offsetBelowStickyHeader);
};

export const isScrollTargetReachable = ({
  scrollHeight,
  clientHeight,
  targetScrollTop,
}: ScrollRangeArgs) => {
  const maximumScrollTop = scrollHeight - clientHeight;
  return targetScrollTop <= maximumScrollTop;
};

/** Positions the first expanded current-term card beneath the sticky header. */
export const useCurrentTermPosition = (currentSemester: number) => {
  const hasPositionedCurrentTerm = useRef(false);

  useEffect(() => {
    if (hasPositionedCurrentTerm.current) return;

    let timeout: number | undefined;
    let attempts = 0;

    const retryPositioning = () => {
      if (attempts++ >= MAX_POSITION_ATTEMPTS) return;
      timeout = window.setTimeout(positionCurrentTerm, POSITION_RETRY_DELAY_MS);
    };

    const getPositionTarget = (): CurrentTermPositionTarget | null => {
      const card = document.querySelector<HTMLElement>(
        '[data-current-semester="true"]',
      );
      if (!card) return null;

      const scrollContainer = card.closest<HTMLElement>(
        "[data-dashboard-schedule-scroll]",
      );
      if (!scrollContainer) return null;

      const trigger = card.querySelector<HTMLElement>(
        '[data-slot="collapsible-trigger"]',
      );
      if (trigger?.getAttribute("aria-expanded") !== "true") return null;

      return { card, scrollContainer };
    };

    const positionCurrentTerm = () => {
      const target = getPositionTarget();
      if (!target) {
        retryPositioning();
        return;
      }

      const { card, scrollContainer } = target;

      const stickyHeader = scrollContainer.querySelector<HTMLElement>(
        "[data-dashboard-schedule-sticky-header]",
      );
      const semesterBounds = card.getBoundingClientRect();
      const scrollContainerBounds = scrollContainer.getBoundingClientRect();
      const stickyHeaderHeight =
        stickyHeader?.getBoundingClientRect().height ?? 0;
      const targetScrollTop = getCurrentTermScrollTarget({
        currentScrollTop: scrollContainer.scrollTop,
        semesterTop: semesterBounds.top,
        scrollContainerTop: scrollContainerBounds.top,
        stickyHeaderHeight,
      });

      if (
        !isScrollTargetReachable({
          scrollHeight: scrollContainer.scrollHeight,
          clientHeight: scrollContainer.clientHeight,
          targetScrollTop,
        })
      ) {
        retryPositioning();
        return;
      }

      scrollContainer.scrollTo({
        top: targetScrollTop,
        behavior: "auto",
      });
      hasPositionedCurrentTerm.current = true;
    };

    timeout = window.setTimeout(positionCurrentTerm, 0);

    return () => {
      if (timeout !== undefined) window.clearTimeout(timeout);
    };
  }, [currentSemester]);
};
