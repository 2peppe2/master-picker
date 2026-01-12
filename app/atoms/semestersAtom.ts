import { produce } from "immer";
import { Course, CourseOccasion } from "../(main)/page";
import { atom } from "jotai";
import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { userPreferencesAtom } from "./UserPreferences";

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

interface AddCoursePayload {
  course: Course;
  occasion: CourseOccasion;
}

export const addCourseToSemesterAtom = atom(
  null,
  (get, set, { course, occasion }: AddCoursePayload) => {
    set(semesterScheduleAtom, (prev) => 
      produce(prev, (draft) => {
        const { startingYear } = get(userPreferencesAtom);
        const relativeYear = yearAndSemesterToRelativeSemester(startingYear, occasion.year, occasion.semester);
        for (const period of occasion.periods) {
          for (const block of occasion.blocks) {
            draft[relativeYear][period - 1][block - 1] = course;
          }
        }
        return draft;
      }));
  }
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
