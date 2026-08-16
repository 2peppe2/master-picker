import type { Course } from "@/common/types";
import { atom } from "jotai";

/** Dashboard catalog hydration is separate from schedule and UI feature state. */
export const coursesAtom = atom<Record<string, Course>>({});

export const courseListAtom = atom((get) => Object.values(get(coursesAtom)));
