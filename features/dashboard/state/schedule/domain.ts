import { produce } from "immer";
import { Course, CourseOccasion } from "@/common/types";
import { ScheduleGrid } from "./types";
import { WILDCARD_BLOCK_START } from "./constants";

interface PlaceCourseArgs {
  course: Course;
  grid: ScheduleGrid;
  occasion: CourseOccasion;
  semesterIndex: number;
}

export const placeCourse = ({
  course,
  grid,
  occasion,
  semesterIndex,
}: PlaceCourseArgs): ScheduleGrid =>
  produce(grid, (draft) => {
    const semester = draft[semesterIndex];
    if (!semester) return;

    for (const period of occasion.periods) {
      if (period.period < 1) continue;
      const periodIndex = period.period - 1;
      const blocks = semester[periodIndex];
      if (!blocks) continue;

      if (period.blocks.length > 0) {
        period.blocks.forEach((block) => {
          blocks[block - 1] = course;
        });
        continue;
      }

      const vacantBlock = blocks.findIndex(
        (slot, index) => index >= WILDCARD_BLOCK_START && slot === null,
      );

      if (vacantBlock >= 0) {
        blocks[vacantBlock] = course;
      } else {
        semester.forEach((semesterPeriod, index) => {
          semesterPeriod.push(index === periodIndex ? course : null);
        });
      }
    }
  });

export const removeCourseFromGrid = (
  grid: ScheduleGrid,
  courseCode: string,
): ScheduleGrid =>
  produce(grid, (draft) => {
    draft.forEach((semester) => {
      semester.forEach((period) => {
        period.forEach((course, index) => {
          if (course?.code === courseCode) period[index] = null;
        });
      });
    });
  });
