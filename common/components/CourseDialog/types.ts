export interface DialogTab {
  name: string;
  value: string;
}

/**
 * Where the tab affordance sits, which is the only thing the three dialog
 * shells actually disagree about.
 *
 * - "top"    centred desktop dialog: underlined row above the panels
 * - "bottom" portrait sheet: native-style tab bar below the panels
 * - "rail"   landscape phone: vertical rail left of the panels, spending the
 *            axis that viewport has to spare
 */
export type DialogChrome = "top" | "bottom" | "rail";

import type { Course, CourseOccasion } from "@/common/types";
import type { ConflictData } from "../ConflictResolverModal";

export interface OccasionActions {
  getCollisions: (occasion: CourseOccasion) => Course[];
  onAdd: (course: Course, occasion: CourseOccasion) => void;
  onResolve: (data: ConflictData, type: "replace" | "extra") => void;
}
