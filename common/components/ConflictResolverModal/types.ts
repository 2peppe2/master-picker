import { Course, CourseOccasion } from "@/common/types";
import { StrategyType } from "./hooks/useCourseContlictResolver";

export interface ConflictData {
  course: Course;
  occasion: CourseOccasion;
  collisions: Course[];
  strategy: StrategyType;
}

export interface ConflictResolverProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  conflictData: ConflictData;
}

/** Shared by both presentations: the two ways out of a block collision. */
export interface ConflictResolutionProps extends ConflictResolverProps {
  onResolve: (type: "replace" | "extra") => (e: React.MouseEvent) => void;
}
