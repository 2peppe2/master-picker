import { Course } from "../dashboard/page";
import { atom } from "jotai";

export const coursesAtom = atom<Record<string, Course>>({});
