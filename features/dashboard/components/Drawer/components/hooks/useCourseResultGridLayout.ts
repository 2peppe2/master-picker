"use client";

import type { Course } from "@/common/types";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

interface UseCourseResultGridLayoutArgs {
  courses: Course[];
  minTileSize: number;
  tileGap: number;
}

export const useCourseResultGridLayout = ({
  courses,
  minTileSize,
  tileGap,
}: UseCourseResultGridLayoutArgs) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const measure = () => {
      const { paddingLeft, paddingRight } = getComputedStyle(container);
      const width =
        container.clientWidth -
        parseFloat(paddingLeft) -
        parseFloat(paddingRight);

      setContentWidth((current) => (current === width ? current : width));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const { columns, tileSize } = useMemo(() => {
    const lanes = Math.max(
      1,
      Math.floor((contentWidth + tileGap) / (minTileSize + tileGap)),
    );

    return {
      columns: lanes,
      tileSize: Math.floor((contentWidth - (lanes - 1) * tileGap) / lanes),
    };
  }, [contentWidth, minTileSize, tileGap]);

  const isMeasured = contentWidth > 0;
  const virtualizer = useVirtualizer({
    count: isMeasured ? courses.length : 0,
    getScrollElement: () => scrollRef.current,
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

  return { scrollRef, tileSize, virtualizer };
};
