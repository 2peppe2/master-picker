import { Course } from "../(main)/page";
import { atom } from "jotai";

type Cell = Course | null;
type SemestersGrid = Cell[][][]; // [semester][period][block]

function createScheduleGrid(
  semesters: number,
  periodsPerSemester: number,
  blocksPerPeriod: number,
  initial: Cell = null
): SemestersGrid {
  return Array.from({ length: semesters }, () =>
    Array.from({ length: periodsPerSemester }, () =>
      Array.from({ length: blocksPerPeriod }, () => initial)
    )
  );
}

export const semesterScheduleAtom = atom<SemestersGrid>(
  createScheduleGrid(9, 2, 4, null)
);

export const selectedCoursesAtom = atom((get) => {
  const semesters = get(semesterScheduleAtom);
  const selectedCourses: Set<Course> = new Set();
  const flattenedCourses = semesters
    .flat(2)
    .filter((course) => course !== null);
  flattenedCourses.forEach((course) => selectedCourses.add(course));
  return [...selectedCourses];
});

export default semesterScheduleAtom;
