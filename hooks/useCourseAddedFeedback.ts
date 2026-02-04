import { Course } from "@/app/dashboard/page";
import { useEffect } from "react";

interface DispatchScrollToCourseArgs {
  course: Course;
}

interface ScrollToCourseEvent {
  courseCode: string;
}

export const dispatchScrollToCourse = ({
  course,
}: DispatchScrollToCourseArgs) => {
  window.dispatchEvent(
    new CustomEvent<ScrollToCourseEvent>("course-added", {
      detail: { courseCode: course.code },
    }),
  );
};

export const useScrollToCourseFeedback = () => {
  useEffect(() => {
    const handleFeedback = (event: Event) => {
      const customEvent = event as CustomEvent<ScrollToCourseEvent>;
      const { courseCode } = customEvent.detail;

      setTimeout(() => {
        const elements = document.querySelectorAll(
          `[data-course-code="${courseCode}"]`,
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
  }, []);
};
