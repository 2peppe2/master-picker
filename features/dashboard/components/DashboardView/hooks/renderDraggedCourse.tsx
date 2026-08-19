import DashboardCourseCard from "@/features/dashboard/components/DashboardCourseCard";
import type { Course } from "@/common/types";
import type { OnRenderDraggedArgs } from "@/features/dashboard/components/DndProvider/types";

export const renderDraggedCourse = ({
  active,
}: OnRenderDraggedArgs<Course>) => (
  <DashboardCourseCard variant="dragged" course={active} />
);
