import { Course } from "@/common/types";
import type { OccasionActions } from "../../../types";

export interface OccasionTableProps {
  course: Course;
  showAdd: boolean;
  preferredSemesters?: number[];
  occasionActions?: OccasionActions;
}
