import { Course } from "@/common/types";

export interface OccasionTableProps {
  course: Course;
  showAdd: boolean;
  preferredSemesters?: number[];
}
