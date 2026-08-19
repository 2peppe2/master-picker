"use client";

import {
  COURSE_ADDED_EVENT,
  CourseAddedEventDetail,
} from "@/common/hooks/useCourseAddedFeedback";
import { useToRelativeSemester } from "@/common/hooks/useToRelativeSemester";
import { openSemesterAtom } from "@/features/dashboard/state/semester-ui/atoms";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

export const useRevealSemesterOnCourseAdded = (semesterNumber: number) => {
  const openSemester = useSetAtom(openSemesterAtom);
  const toRelativeSemester = useToRelativeSemester();
  const target = semesterNumber + 1;

  useEffect(() => {
    const revealAddedCourse = (event: Event) => {
      const { occasion } = (event as CustomEvent<CourseAddedEventDetail>)
        .detail;
      const targetSemester = toRelativeSemester({
        year: occasion.year,
        semester: occasion.semester,
      });

      if (targetSemester === semesterNumber) {
        openSemester(target);
      }
    };

    window.addEventListener(COURSE_ADDED_EVENT, revealAddedCourse);
    return () =>
      window.removeEventListener(COURSE_ADDED_EVENT, revealAddedCourse);
  }, [openSemester, semesterNumber, target, toRelativeSemester]);
};
