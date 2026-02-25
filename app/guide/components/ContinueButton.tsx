"use client";

import { useScheduleMutators } from "@/app/atoms/schedule/hooks/useScheduleMutators";
import { useRouter, useSearchParams } from "next/navigation";
import { normalizeCourse } from "@/app/courseNormalizer";
import { ArrowRight, Loader2 } from "lucide-react";
import { FC, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Course } from "@/app/dashboard/page";
import { CourseRequirements } from "../page";

interface ContinueButtonProps {
  disabled?: boolean;
  bachelorCourses: Course[];
  compulsoryCourses: CourseRequirements;
  electiveCourses: Record<number, Course[]>;
}

const ContinueButton: FC<ContinueButtonProps> = ({
  bachelorCourses,
  compulsoryCourses,
  electiveCourses,
  disabled,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setInitialCourses } = useScheduleMutators();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleClick = useCallback(() => {
    setIsLoading(true);

    try {
      const bachelorEntries = bachelorCourses.map((course) => ({
        course,
        occasion: course.CourseOccasion[0],
      }));

      const electiveEntries = Object.values(electiveCourses)
        .filter((c) => !!c)
        .flatMap((courses) =>
          courses.map((course) => ({
            course,
            occasion: course.CourseOccasion?.[0],
          })),
        );

      const compulsoryEntries = Object.values(compulsoryCourses)
        .flatMap((course) => course.courses)
        .map(({ course }) => normalizeCourse(course))
        .map((course) => ({
          course,
          occasion: course.CourseOccasion?.[0],
        }));

      setInitialCourses({
        entries: [...bachelorEntries, ...electiveEntries, ...compulsoryEntries],
      });

      router.push(`/dashboard?${searchParams.toString()}`);
    } catch (error) {
      console.error("Navigation failed", error);
      setIsLoading(false);
    }
  }, [
    bachelorCourses,
    compulsoryCourses,
    electiveCourses,
    router,
    searchParams,
    setInitialCourses,
  ]);

  return (
    <Button
      className="mt-4"
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
};

export default ContinueButton;
