"use client";

import { useToRelativeSemester } from "@/common/hooks/useToRelativeSemester";
import { useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";
import {
  addBlockToSemesterAtom,
  addCourseAtom,
  deleteBlockFromSemesterAtom,
  removeCourseAtom,
} from "../atoms";
import type {
  AddCourseArgs,
  DeleteBlockFromSemesterArgs,
  RemoveCourseArgs,
} from "../types";

export const useCourseCommands = () => {
  const toRelativeSemester = useToRelativeSemester();
  const add = useSetAtom(addCourseAtom);
  const remove = useSetAtom(removeCourseAtom);
  const addCourse = useCallback(
    ({ course, occasion }: AddCourseArgs) =>
      add({
        course,
        occasion,
        semesterIndex: toRelativeSemester({
          year: occasion.year,
          semester: occasion.semester,
        }),
      }),
    [add, toRelativeSemester],
  );
  const removeCourse = useCallback(
    (args: RemoveCourseArgs) => remove(args),
    [remove],
  );
  return useMemo(
    () => ({ addCourse, removeCourse }),
    [addCourse, removeCourse],
  );
};

export const useBlockCommands = () => {
  const add = useSetAtom(addBlockToSemesterAtom);
  const remove = useSetAtom(deleteBlockFromSemesterAtom);
  const addBlockToSemester = useCallback(
    (semester: number) => add(semester),
    [add],
  );
  const deleteBlockFromSemester = useCallback(
    (args: DeleteBlockFromSemesterArgs) => remove(args),
    [remove],
  );
  return useMemo(
    () => ({ addBlockToSemester, deleteBlockFromSemester }),
    [addBlockToSemester, deleteBlockFromSemester],
  );
};
