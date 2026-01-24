import { Course } from "../dashboard/page";
import { atom } from "jotai";

export const activeCourseAtom = atom<Course | null>(null);
