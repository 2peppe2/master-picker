"use client";

import { useFiltered } from "@/features/dashboard/state/filter/hooks/useFiltered";
import { Draggable } from "@/features/dashboard/components/DndProvider/Draggable";
import { draggedCourseAtom } from "@/features/dashboard/state/drag/atoms";
import { scheduledCourseCodesAtom } from "@/features/dashboard/state/schedule/atoms";
import { courseListAtom } from "@/features/dashboard/state/catalog-data/atoms";
import EmptyCourseState from "./EmptyCourseState";
import CourseCard from "@/common/components/CourseCard";
import { useSortedCourses } from "@/common/hooks/useSortedCourses";
import type { Course } from "@/common/types";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useAtomValue } from "jotai";
import { memo, useLayoutEffect, useMemo, useRef } from "react";
import { useMediaQuery } from "react-responsive";

interface CourseResultGridProps {
  courses: Course[];
  draggedCourseCode: string | undefined;
}

const CourseResultGrid = memo<CourseResultGridProps>(
  ({ courses, draggedCourseCode }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasThreeColumns = useMediaQuery({ query: "(min-width: 1536px)" });
    const columns = hasThreeColumns ? 3 : 2;
    const virtualizer = useVirtualizer({
      count: courses.length,
      getScrollElement: () => scrollRef.current,
      estimateSize: () => 176,
      gap: 16,
      lanes: columns,
      overscan: 3,
      getItemKey: (index) => courses[index]?.code ?? index,
    });

    // A breakpoint changes the virtualizer from two lanes to three. Its item
    // measurements belong to the old lane geometry, so invalidate them before
    // the browser paints the new grid instead of occasionally reusing stale
    // offsets after a resize or compact/desktop transition.
    useLayoutEffect(() => {
      virtualizer.measure();
    }, [columns, virtualizer]);

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
                className="absolute top-0 px-2"
                style={{
                  left: `${(virtualItem.lane / columns) * 100}%`,
                  transform: `translateY(${virtualItem.start}px)`,
                  width: `${100 / columns}%`,
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
  },
);

const CourseResults = memo(() => {
  const courses = useAtomValue(courseListAtom);
  const draggedCourse = useAtomValue(draggedCourseAtom);
  const scheduledCourseCodes = useAtomValue(scheduledCourseCodesAtom);
  const filteredCourses = useFiltered({ courses });
  const sortedCourses = useSortedCourses({ courses: filteredCourses });

  const availableCourses = useMemo(
    () =>
      sortedCourses.filter((course) => !scheduledCourseCodes.has(course.code)),
    [scheduledCourseCodes, sortedCourses],
  );

  return (
    <CourseResultGrid
      courses={availableCourses}
      draggedCourseCode={draggedCourse?.code}
    />
  );
});

CourseResultGrid.displayName = "CourseResultGrid";
CourseResults.displayName = "CourseResults";

export default CourseResults;
