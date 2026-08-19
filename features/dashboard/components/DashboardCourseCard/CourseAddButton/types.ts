import type { Course, CourseOccasion } from "@/common/types";

export interface CourseAddButtonProps {
  course: Course;
}

/**
 * Plain data, so each presentation renders the occasion picker itself rather
 * than receiving a prebuilt element that changes identity on every render.
 */
export interface OccasionPickerViewProps {
  course: Course;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  preferredSemesters: number[];
  onSelect: (occasion: CourseOccasion) => void;
}
