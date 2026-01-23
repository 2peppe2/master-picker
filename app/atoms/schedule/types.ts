import { Course, CourseOccasion } from "../../dashboard/page";

export interface AddCourseArgs {
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

export interface ToggleShownSemesterArgs {
  semester: number;
}
