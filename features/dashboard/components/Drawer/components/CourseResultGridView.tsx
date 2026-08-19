"use client";

import { Draggable } from "@/features/dashboard/components/DndProvider/Draggable";
import EmptyCourseState from "./EmptyCourseState";
import CourseCard from "@/common/components/CourseCard";
import { CourseResultGridViewProps } from "./CourseResultGrid.types";
import { useCourseResultGridLayout } from "./hooks/useCourseResultGridLayout";
import { FC, memo } from "react";

const CourseResultGridView: FC<CourseResultGridViewProps> = ({
  courses,
  draggedCourseCode,
  minTileSize,
  tileGap,
}) => {
  const { scrollRef, tileSize, virtualizer } = useCourseResultGridLayout({
    courses,
    minTileSize,
    tileGap,
  });

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

export default memo(CourseResultGridView);
