"use client";

import { atom } from "jotai";

export interface CustomCourseInput {
  code: string;
  name: string;
  hp: number;
}

export const customCoursesAtoms = {
  customCoursesAtom: atom<CustomCourseInput[]>([]),
};
