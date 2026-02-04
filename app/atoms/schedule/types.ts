import { Course, CourseOccasion } from "../../dashboard/page";

export type Slot = Course | null;
export type ScheduleGrid = Slot[][][]; // [semester][period][block]

export type AddCourseAction = "dropped" | "default";

export interface AddCourseByButtonArgs {
  course: Course;
  occasion: CourseOccasion;
}

export interface DeleteBlockFromSemesterArgs {
  semester: number;
  blockIndex: number;
}

export interface AddCourseByDropArgs {
  course: Course;
  occasion: CourseOccasion;
}

export interface RemoveCourseArgs {
  courseCode: string;
}

export interface GetSlotCourseArgs {
  semester: number;
  period: number;
  block: number;
}

export interface GetSlotBlocksArgs {
  semester: number;
  period: number;
}

export interface GetSlotPeriodsArgs {
  semester: number;
}

export interface GetOccasionCollisionsArgs {
  occasion: CourseOccasion;
}

export interface AddBlockToSemesterArgs {
  semester: number;
}

export interface DeleteBlockFromSemesterArgs {
  semester: number;
}

export interface ToggleShownSemesterArgs {
  semester: number;
}

export interface CheckWildcardExpansionArgs {
  occasion: CourseOccasion;
}

export interface FindMatchingOccasionArgs {
  course: Course;
  year: number;
  semester: string;
  period: number;
  block: number;
}

export interface HasMatchingOccasionArgs {
  course: Course;
  periods: number[];
  blocks: number[];
}
