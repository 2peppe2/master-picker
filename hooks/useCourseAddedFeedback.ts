"use client";

import { yearAndSemesterToRelativeSemester } from "@/lib/semesterYearTranslations";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { Course, CourseOccasion } from "@/app/dashboard/page";
import { filterAtoms } from "@/app/atoms/filter/atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

interface DispatchScrollToCourseArgs {
  course: Course;
  occasion: CourseOccasion;
}

interface ScrollToCourseEvent {
  course: Course;
  occasion: CourseOccasion;
}

export const dispatchScrollToCourse = (args: DispatchScrollToCourseArgs) => {
  window.dispatchEvent(
    new CustomEvent<ScrollToCourseEvent>("course-added", {
      detail: args,
    }),
  );
};

export const useScrollToCourseFeedback = () => {
  const { startingYear } = useAtomValue(userPreferencesAtom);
  const showSemester = useSetAtom(filterAtoms.semesterAtom);

  useEffect(() => {
    const handleFeedback = (event: Event) => {
      const customEvent = event as CustomEvent<ScrollToCourseEvent>;
      const { course, occasion } = customEvent.detail;

      const relativeSemester = yearAndSemesterToRelativeSemester(
        startingYear,
        occasion.year,
        occasion.semester,
      );

      showSemester(relativeSemester + 1);

      setTimeout(() => {
        const elements = document.querySelectorAll(
          `[data-course-code="${course.code}"]`,
        );

        if (elements.length > 0) {
          elements[0].scrollIntoView({ behavior: "smooth", block: "center" });

          const classes = [
            "border-teal-500",
            "border-2",
            "shadow-lg",
            "shadow-teal-500/20",
            "scale-[1.03]",
            "transition-all",
            "duration-150",
          ];

          elements.forEach((el) => {
            el.classList.add(...classes);
            setTimeout(() => el.classList.remove(...classes), 1000);
          });
        }
      }, 100);
    };

    window.addEventListener("course-added", handleFeedback);
    return () => window.removeEventListener("course-added", handleFeedback);
  }, [startingYear, showSemester]);
};
