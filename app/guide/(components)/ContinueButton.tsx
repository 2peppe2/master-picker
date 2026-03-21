"use client";

import { useGeneratePrefilledSchedule } from "@/app/dashboard/(store)/schedule/hooks/useGeneratePrefilledSchedule";
import { serializeSchedule } from "@/app/dashboard/(store)/schedule/utils";
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
  selectedOccasions: Record<string, number>;
}

const ContinueButton: FC<ContinueButtonProps> = ({
  bachelorCourses,
  compulsoryCourses,
  electiveCourses,
  selectedOccasions,
  disabled,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const generateGrid = useGeneratePrefilledSchedule();

  const handleClick = useCallback(() => {
    setIsLoading(true);

    try {
      const bachelorList = bachelorCourses;
      const electiveList = Object.values(electiveCourses).flat();
      const compulsoryList = Object.values(compulsoryCourses)
        .flatMap((req) => req.courses)
        .map((c) => normalizeCourse(c.course));

      const allSelectedCourses = [
        ...bachelorList,
        ...electiveList,
        ...compulsoryList,
      ];

      const coursesMap = Object.fromEntries(
        allSelectedCourses.map((c) => [c.code, c]),
      );

      const newGrid = generateGrid({
        courses: allSelectedCourses,
        selectedOccasions,
      });

      const compressed = serializeSchedule(coursesMap, newGrid);

      if (compressed) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("schedule", compressed);
        router.push(`/dashboard?${params.toString()}`);
      }
    } catch (error) {
      console.error("Navigation failed", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    bachelorCourses,
    compulsoryCourses,
    electiveCourses,
    selectedOccasions,
    router,
    searchParams,
    generateGrid,
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
