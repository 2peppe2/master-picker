import type { Course } from "@/common/types";
import { atom } from "jotai";

export const coursesAtom = atom<Record<string, Course>>({});

export const courseListAtom = atom((get) => Object.values(get(coursesAtom)));
