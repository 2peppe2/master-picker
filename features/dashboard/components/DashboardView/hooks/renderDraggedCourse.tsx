import CourseCard from "@/common/components/CourseCard";
import type { Course } from "@/common/types";
import type { OnRenderDraggedArgs } from "@/features/dashboard/components/DndProvider/types";

export const renderDraggedCourse = ({
  active,
}: OnRenderDraggedArgs<Course>) => (
  <CourseCard variant="dragged" course={active} />
);
