"use client";

import { useGeneratePrefilledSchedule } from "@/features/dashboard/state/schedule/hooks/useGeneratePrefilledSchedule";
import { serializeSchedule } from "@/features/dashboard/state/schedule/utils";
import Translate from "@/common/components/translate/Translate";
import { useRouter, useSearchParams } from "next/navigation";
import { normalizeCourse } from "@/common/courseNormalizer";
import { ArrowRight, Loader2 } from "lucide-react";
import { FC, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Course } from "@/common/types";
import type { CourseRequirements } from "@/features/guide/types";

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

      const startingYear = parseInt(searchParams.get("year") ?? "", 10);
      if (Number.isNaN(startingYear)) {
        throw new Error("A valid starting year is required");
      }

      const newGrid = generateGrid({
        courses: allSelectedCourses,
        startingYear,
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
    router,
    searchParams,
    generateGrid,
  ]);

  return (
    <Button
      className="h-11 w-full sm:w-auto"
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <Translate text="_guide_processing" />
        </>
      ) : (
        <>
          <Translate text="_guide_continue" />
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
};

export default ContinueButton;
