"use client";

import { customCoursesAtoms, CustomCourseInput } from "./atoms";
import { ReadonlyURLSearchParams } from "next/navigation";
import { coursesAtom } from "../../(store)/store";
import { Course } from "@/app/dashboard/page";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { atom } from "jotai";

const PARAM_NAME = "custom";

export const normalizeCustomCourse = (input: CustomCourseInput): Course =>
  ({
    code: `custom_${input.code}`,
    name: input.name,
    credits: input.hp,
    level: "",
    department: "",
    examiner: "",
    mainField: [],
    CourseOccasion: [],
    Examination: [],
    CourseMaster: [],
    ProgramCourse: [],
  }) as unknown as Course;

export const serializeCustomCourses = (
  courses: CustomCourseInput[],
): string | null => {
  if (!courses.length) return null;
  return compressToEncodedURIComponent(JSON.stringify(courses));
};

export const deserializeCustomCourses = (
  param: string,
): CustomCourseInput[] | null => {
  try {
    const decompressed = decompressFromEncodedURIComponent(param);
    if (!decompressed) return null;
    return JSON.parse(decompressed) as CustomCourseInput[];
  } catch (e) {
    console.error("Failed to restore custom courses from URL payload", e);
    return null;
  }
};

interface WriteCustomCoursesToUrlAtomArgs {
  searchParams: ReadonlyURLSearchParams;
  setSearchParam: (name: string, value: string | null) => void;
}

export const writeCustomCoursesToUrlAtom = atom(
  null,
  (
    get,
    _set,
    { searchParams, setSearchParam }: WriteCustomCoursesToUrlAtomArgs,
  ) => {
    const courses = get(customCoursesAtoms.customCoursesAtom);
    const compressed = serializeCustomCourses(courses);

    if (searchParams.get(PARAM_NAME) !== compressed) {
      setSearchParam(PARAM_NAME, compressed);
    }
  },
);

interface ReadCustomCoursesFromUrlAtomArgs {
  searchParams: ReadonlyURLSearchParams;
}

export const readCustomCoursesFromUrlAtom = atom(
  null,
  (get, set, { searchParams }: ReadCustomCoursesFromUrlAtomArgs) => {
    const param = searchParams.get(PARAM_NAME);
    if (!param) return;

    const parsed = deserializeCustomCourses(param);
    if (!parsed) return;

    set(customCoursesAtoms.customCoursesAtom, parsed);

    // Inject into coursesAtom
    const courses = get(coursesAtom);
    const newCoursesMap = { ...courses };
    let hasChanges = false;

    parsed.forEach((input) => {
      const normalized = normalizeCustomCourse(input);
      if (!newCoursesMap[normalized.code]) {
        newCoursesMap[normalized.code] = normalized;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      set(coursesAtom, newCoursesMap);
    }
  },
);
