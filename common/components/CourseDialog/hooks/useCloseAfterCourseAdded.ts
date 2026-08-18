"use client";

import {
  COURSE_ADDED_EVENT,
  type CourseAddedEventDetail,
} from "@/common/hooks/useCourseAddedFeedback";
import { useEffect } from "react";

interface UseCloseAfterCourseAddedArgs {
  courseCode: string;
  onClose: () => void;
  open: boolean;
}

export const useCloseAfterCourseAdded = ({
  courseCode,
  onClose,
  open,
}: UseCloseAfterCourseAddedArgs) => {
  useEffect(() => {
    if (!open) return;

    const closeAfterAdd = (event: Event) => {
      const { course } = (event as CustomEvent<CourseAddedEventDetail>).detail;
      if (course.code === courseCode) onClose();
    };

    window.addEventListener(COURSE_ADDED_EVENT, closeAfterAdd);
    return () => window.removeEventListener(COURSE_ADDED_EVENT, closeAfterAdd);
  }, [courseCode, onClose, open]);
};
