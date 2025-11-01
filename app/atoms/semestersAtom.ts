import { atom } from 'jotai';

const semestersAtom = atom<(string | null)[][][]>([
    [
        [null, null, null, null], // Period 1
        [null, null, null, null], // Period 2
    ], [
        [null, null, null, null], // Period 1
        [null, null, null, null], // Period 2
    ],
    [
        [null, null, null, null], // Period 1
        [null, null, null, null], // Period 2
    ]

]);

export const selectedCoursesAtom = atom((get) => {
    const semesters = get(semestersAtom);
    const selectedCourses: Set<string> = new Set();
    const flattenedCourses = semesters.flat(2).filter((course): course is string => course !== null)
    flattenedCourses.forEach((course) => selectedCourses.add(course));
    return [...selectedCourses];
});



export default semestersAtom