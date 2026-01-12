import { Course } from "../courses";
import { atom } from "jotai";

export const activeCourseAtom = atom<Course | null>(null);
