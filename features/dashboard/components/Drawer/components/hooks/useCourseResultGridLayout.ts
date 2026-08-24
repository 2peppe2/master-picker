"use client";

import type { Course } from "@/common/types";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";

interface GetGridLayoutArgs {
  contentWidth: number;
  minTileSize: number;
  tileGap: number;
}

/**
 * Turns a measured content width into a lane count and tile size. A width that
 * is not a positive finite number means the container has not been measured
 * yet, and the virtualizer must never see a `NaN` lane count.
 */
export const getGridLayout = ({
  contentWidth,
  minTileSize,
  tileGap,
}: GetGridLayoutArgs) => {
  if (!Number.isFinite(contentWidth) || contentWidth <= 0) {
    return { columns: 1, tileSize: 0, isMeasured: false };
  }

  const columns = Math.max(
    1,
    Math.floor((contentWidth + tileGap) / (minTileSize + tileGap)),
  );

  return {
    columns,
    tileSize: Math.max(
      0,
      Math.floor((contentWidth - (columns - 1) * tileGap) / columns),
    ),
    isMeasured: true,
  };
};

interface UseCourseResultGridLayoutArgs {
  courses: Course[];
  minTileSize: number;
  tileGap: number;
}

const parsePadding = (value: string) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const useCourseResultGridLayout = ({
  courses,
  minTileSize,
  tileGap,
}: UseCourseResultGridLayoutArgs) => {
  // The container unmounts whenever the result set empties, so the element is
  // held in state: the observer has to follow it back on remount.
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (!scrollElement) return;

    const measure = () => {
      // A detached node reports no computed padding, which would otherwise
      // poison the width with NaN.
      if (!scrollElement.isConnected) return;

      const { paddingLeft, paddingRight } = getComputedStyle(scrollElement);
      const width =
        scrollElement.clientWidth -
        parsePadding(paddingLeft) -
        parsePadding(paddingRight);

      if (!Number.isFinite(width) || width < 0) return;

      setContentWidth((current) => (current === width ? current : width));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(scrollElement);
    return () => observer.disconnect();
  }, [scrollElement]);

  const { columns, tileSize, isMeasured } = useMemo(
    () => getGridLayout({ contentWidth, minTileSize, tileGap }),
    [contentWidth, minTileSize, tileGap],
  );

  const virtualizer = useVirtualizer({
    count: isMeasured ? courses.length : 0,
    getScrollElement: () => scrollElement,
    estimateSize: () => tileSize,
    gap: tileGap,
    lanes: columns,
    overscan: 3,
    getItemKey: (index) => courses[index]?.code ?? index,
  });

  useLayoutEffect(() => {
    if (!isMeasured) return;
    virtualizer.measure();
  }, [columns, tileSize, isMeasured, virtualizer]);

  return { scrollRef: setScrollElement, tileSize, virtualizer };
};
