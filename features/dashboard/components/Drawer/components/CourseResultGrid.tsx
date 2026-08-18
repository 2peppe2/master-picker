"use client";

import { Draggable } from "@/features/dashboard/components/DndProvider/Draggable";
import EmptyCourseState from "./EmptyCourseState";
import CourseCard from "@/common/components/CourseCard";
import type { Course } from "@/common/types";
import { useIsLandscapePhone } from "@/common/hooks/useResponsiveLayout";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  FC,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface CourseResultGridProps {
  courses: Course[];
  draggedCourseCode: string | undefined;
}

const MIN_TILE_SIZE = 130;
const TILE_GAP = 12;

/*
 * Landscape runs a clamp(21rem, 42%, 25rem) drawer, so the measured content
 * width lands between roughly 309px and 373px. Across that whole range a 92px
 * floor with an 8px gap resolves to exactly three lanes: four would need 392px
 * and two would need under 192px, and neither is reachable inside the clamp.
 * That means the lane count cannot flicker while the device rotates.
 */
const LANDSCAPE_MIN_TILE_SIZE = 92;
const LANDSCAPE_TILE_GAP = 8;

const CourseResultGrid: FC<CourseResultGridProps> = ({
  courses,
  draggedCourseCode,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  // Read from the hook rather than a CSS custom property: rotating can change
  // the variable without changing clientWidth, and the ResizeObserver below
  // would not fire, leaving the lane count stale.
  const isLandscapePhone = useIsLandscapePhone();
  const minTileSize = isLandscapePhone ? LANDSCAPE_MIN_TILE_SIZE : MIN_TILE_SIZE;
  const tileGap = isLandscapePhone ? LANDSCAPE_TILE_GAP : TILE_GAP;

  // The panel decides how many tiles fit; the tiles then share its full width
  // so the grid lines up with the search bar above it. The observer fires on
  // any content-box change -- including a scrollbar appearing as results come
  // and go -- so it is set up once rather than per result set.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const measure = () => {
      const { paddingLeft, paddingRight } = getComputedStyle(container);
      const width =
        container.clientWidth -
        parseFloat(paddingLeft) -
        parseFloat(paddingRight);

      // Only a real change is worth a render; a resize that leaves the width
      // alone would otherwise re-run the whole grid.
      setContentWidth((current) => (current === width ? current : width));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const { columns, tileSize } = useMemo(() => {
    // The trailing lane needs no gap after it, hence the extra tileGap.
    const lanes = Math.max(
      1,
      Math.floor((contentWidth + tileGap) / (minTileSize + tileGap)),
    );

    return {
      columns: lanes,
      tileSize: Math.floor((contentWidth - (lanes - 1) * tileGap) / lanes),
    };
  }, [contentWidth, minTileSize, tileGap]);

  // Until the panel has been measured every tile would be sized 0, so the
  // layout pass would be thrown away on the very next render. Holding the
  // count at 0 skips that pass entirely.
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

  // A resize changes the lane count and tile size. Item measurements belong
  // to the old geometry, so invalidate them before the browser paints the new
  // grid instead of occasionally reusing stale offsets.
  useLayoutEffect(() => {
    if (!isMeasured) return;
    virtualizer.measure();
  }, [columns, tileSize, isMeasured, virtualizer]);

  if (courses.length === 0) return <EmptyCourseState />;

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 pb-4 pt-1 lg:px-5"
    >
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const course = courses[virtualItem.index];
          if (!course) return null;

          return (
            <div
              key={virtualItem.key}
              ref={virtualizer.measureElement}
              data-index={virtualItem.index}
              className="absolute top-0"
              style={{
                left: `${virtualItem.lane * (tileSize + tileGap)}px`,
                transform: `translateY(${virtualItem.start}px)`,
                width: `${tileSize}px`,
              }}
            >
              {draggedCourseCode === course.code ? (
                <CourseCard variant="ghost" course={course} />
              ) : (
                <Draggable id={course.code} data={course}>
                  <CourseCard variant="grabbable" course={course} />
                </Draggable>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(CourseResultGrid);
