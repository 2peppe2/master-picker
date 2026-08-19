import { Course, CourseOccasion } from "@/common/types";
export type StrategyType = "dropped" | "button";

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
  onResolve: (type: "replace" | "extra") => void;
}

export interface ConflictResolutionProps
  extends Omit<ConflictResolverProps, "onResolve"> {
  onResolve: (type: "replace" | "extra") => (e: React.MouseEvent) => void;
}
