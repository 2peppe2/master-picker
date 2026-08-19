import type { Course } from "@/common/types";

export interface CourseResultGridProps {
  courses: Course[];
  draggedCourseCode: string | undefined;
}

export interface CourseResultGridViewProps extends CourseResultGridProps {
  minTileSize: number;
  tileGap: number;
}
