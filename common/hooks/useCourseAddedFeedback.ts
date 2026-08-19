"use client";

import { Course, CourseOccasion } from "@/common/types";
import { useEffect } from "react";

export const COURSE_ADDED_EVENT = "course-added";

export interface CourseAddedEventDetail {
  course: Course;
  occasion: CourseOccasion;
}

export const dispatchScrollToCourse = (args: CourseAddedEventDetail) => {
  window.dispatchEvent(
    new CustomEvent<CourseAddedEventDetail>(COURSE_ADDED_EVENT, {
      detail: args,
    }),
  );
};

interface UseScrollToCourseFeedbackArgs {
  onRevealSchedule: () => void;
}

const FEEDBACK_CLASSES = [
  "border-teal-500",
  "border-2",
  "shadow-lg",
  "shadow-teal-500/20",
  "scale-[1.03]",
  "transition-all",
  "duration-150",
];

export const useScrollToCourseFeedback = ({
  onRevealSchedule,
}: UseScrollToCourseFeedbackArgs) => {
  useEffect(() => {
    let revealTimer: ReturnType<typeof setTimeout> | null = null;
    let highlightTimer: ReturnType<typeof setTimeout> | null = null;
    let revealFrame: number | null = null;
    let highlightedElements: Element[] = [];

    const handleFeedback = (event: Event) => {
      const customEvent = event as CustomEvent<CourseAddedEventDetail>;
      const { course } = customEvent.detail;

      onRevealSchedule();

      if (revealTimer) clearTimeout(revealTimer);

      if (highlightTimer) clearTimeout(highlightTimer);

      if (revealFrame) cancelAnimationFrame(revealFrame);
      highlightedElements.forEach((element) =>
        element.classList.remove(...FEEDBACK_CLASSES),
      );
      highlightedElements = [];

      const revealCourse = (startedAt: number) => {
        const elements = document.querySelectorAll(
          `[data-course-code="${course.code}"]`,
        );
        const visibleElements = Array.from(elements).filter(
          (element) => element.getClientRects().length > 0,
        );

        if (visibleElements.length === 0) {
          if (performance.now() - startedAt < 1000) {
            revealFrame = requestAnimationFrame(() => revealCourse(startedAt));
          }
          return;
        }

        visibleElements[0].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        highlightedElements = Array.from(elements);
        highlightedElements.forEach((element) =>
          element.classList.add(...FEEDBACK_CLASSES),
        );
        highlightTimer = setTimeout(() => {
          highlightedElements.forEach((element) =>
            element.classList.remove(...FEEDBACK_CLASSES),
          );
          highlightedElements = [];
        }, 1000);
      };

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      revealTimer = setTimeout(
        () => revealCourse(performance.now()),
        reducedMotion ? 0 : 350,
      );
    };

    window.addEventListener(COURSE_ADDED_EVENT, handleFeedback);
    return () => {
      window.removeEventListener(COURSE_ADDED_EVENT, handleFeedback);
      if (revealTimer) clearTimeout(revealTimer);

      if (highlightTimer) clearTimeout(highlightTimer);

      if (revealFrame) cancelAnimationFrame(revealFrame);
      highlightedElements.forEach((element) =>
        element.classList.remove(...FEEDBACK_CLASSES),
      );
    };
  }, [onRevealSchedule]);
};

export const useCompactCourseAddedFeedback = (
  args: UseScrollToCourseFeedbackArgs,
) => useScrollToCourseFeedback(args);

const revealDesktopSchedule = () => undefined;

export const useDesktopCourseAddedFeedback = () =>
  useScrollToCourseFeedback({ onRevealSchedule: revealDesktopSchedule });
