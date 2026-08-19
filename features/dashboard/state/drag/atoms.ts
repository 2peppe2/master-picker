import type { Course } from "@/common/types";
import { atom } from "jotai";
import { atomFamily } from "jotai-family";
import type { CompatibleSemester } from "./domain";

const draggedCourseStateAtom = atom<Course | null>(null);
const validDropTargetIdsStateAtom = atom<ReadonlySet<string>>(
  new Set<string>(),
);
const currentDropTargetIdStateAtom = atom<string | null>(null);
const compatibleSemestersStateAtom = atom<readonly CompatibleSemester[]>([]);

export const draggedCourseAtom = atom((get) => get(draggedCourseStateAtom));
export const validDropTargetIdsAtom = atom((get) =>
  get(validDropTargetIdsStateAtom),
);
export const currentDropTargetIdAtom = atom((get) =>
  get(currentDropTargetIdStateAtom),
);
export const compatibleDragSemestersAtom = atom((get) =>
  get(compatibleSemestersStateAtom),
);

const isValidDropTargetAtomFamily = atomFamily((id: string) =>
  atom((get) => get(validDropTargetIdsStateAtom).has(id)),
);
const isCurrentDropTargetAtomFamily = atomFamily((id: string) =>
  atom((get) => get(currentDropTargetIdStateAtom) === id),
);
const isCourseBeingDraggedAtomFamily = atomFamily((courseCode: string) =>
  atom((get) => get(draggedCourseStateAtom)?.code === courseCode),
);
const compatibleTargetCountAtomFamily = atomFamily((semester: number) =>
  atom(
    (get) =>
      get(compatibleSemestersStateAtom).find(
        (item) => item.semesterNumber === semester,
      )?.targetCount,
  ),
);

export const isValidDropTargetAtom = (id: string) =>
  isValidDropTargetAtomFamily(id);
export const isCurrentDropTargetAtom = (id: string) =>
  isCurrentDropTargetAtomFamily(id);
export const isCourseBeingDraggedAtom = (courseCode: string) =>
  isCourseBeingDraggedAtomFamily(courseCode);
export const compatibleTargetCountAtom = (semester: number) =>
  compatibleTargetCountAtomFamily(semester);

export const setDraggedCourseAtom = atom(
  null,
  (_get, set, course: Course | null) => {
    set(draggedCourseStateAtom, course);
  },
);
export const setValidDropTargetIdsAtom = atom(
  null,
  (_get, set, ids: ReadonlySet<string>) => {
    set(validDropTargetIdsStateAtom, ids);
  },
);
export const setCurrentDropTargetIdAtom = atom(
  null,
  (_get, set, id: string | null) => {
    set(currentDropTargetIdStateAtom, id);
  },
);
export const setCompatibleDragSemestersAtom = atom(
  null,
  (_get, set, semesters: readonly CompatibleSemester[]) => {
    set(compatibleSemestersStateAtom, semesters);
  },
);
export const clearDragAtom = atom(null, (_get, set) => {
  set(draggedCourseStateAtom, null);
  set(validDropTargetIdsStateAtom, new Set<string>());
  set(currentDropTargetIdStateAtom, null);
  set(compatibleSemestersStateAtom, []);
});
