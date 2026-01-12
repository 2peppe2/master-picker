import { Course } from "../(main)/page";
import { atom } from "jotai";

export const activeCourseAtom = atom<Course | null>(null);
