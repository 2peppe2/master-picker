import { atom } from 'jotai';
import { courseWithOccasions } from '@/app/(main)/type';

type Cell = courseWithOccasions | null;
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
    const selectedCourses: Set<string> = new Set();
    const flattenedCourses = semesters.flat(2).filter((course): course is string => course !== null)
    flattenedCourses.forEach((course) => selectedCourses.add(course));
    return [...selectedCourses];
});



export default semesterScheduleAtom