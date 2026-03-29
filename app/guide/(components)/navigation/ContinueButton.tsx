"use client";

import { useGeneratePrefilledSchedule } from "@/app/dashboard/(store)/schedule/hooks/useGeneratePrefilledSchedule";
import { serializeSchedule } from "@/app/dashboard/(store)/schedule/utils";
import Translate from "@/common/components/translate/Translate";
import { useCourseCollisions, CourseCollision } from "@/app/dashboard/(store)/schedule/hooks/useCourseCollisions";
import GuideCollisionDialog from "../dialogs/GuideCollisionDialog";
import { useRouter, useSearchParams } from "next/navigation";
import { normalizeCourse } from "@/app/courseNormalizer";
import { ArrowRight, Loader2 } from "lucide-react";
import { FC, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Course } from "@/app/dashboard/page";
import { CourseRequirements } from "../../page";
import { cn } from "@/lib/utils";

interface ContinueButtonProps {
  disabled?: boolean;
  bachelorCourses: Course[];
  compulsoryCourses: CourseRequirements;
  electiveCourses: Record<number, Course[]>;
  selectedOccasions: Record<string, number>;
  onOccasionChange: (courseCode: string, index: number) => void;
  hasCollisions: boolean;
  className?: string;
}

const ContinueButton: FC<ContinueButtonProps> = ({
  bachelorCourses,
  compulsoryCourses,
  electiveCourses,
  selectedOccasions,
  onOccasionChange,
  hasCollisions,
  disabled,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCollisionDialog, setShowCollisionDialog] = useState(false);
  const [collisions, setCollisions] = useState<CourseCollision[]>([]);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  const generateGrid = useGeneratePrefilledSchedule();
  const getCollisions = useCourseCollisions();

  const executeNavigation = useCallback((coursesToSave: Course[]) => {
    try {
      const coursesMap = Object.fromEntries(
        coursesToSave.map((c) => [c.code, c]),
      );

      const newGrid = generateGrid({ courses: coursesToSave });

      const compressed = serializeSchedule(coursesMap, newGrid);

      if (compressed) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("schedule", compressed);
        router.push(`/dashboard?${params.toString()}`);
      }
    } catch (error) {
      console.error("Navigation failed", error);
      setIsLoading(false);
    }
  }, [generateGrid, router, searchParams]);

  const getAllSelectedCourses = useCallback(() => {
    const bachelorList = bachelorCourses;
    const electiveList = Object.values(electiveCourses).flat();
    const compulsoryList = Object.values(compulsoryCourses)
      .flatMap((req) => req.courses)
      .map((c) => normalizeCourse(c.course));

    return [
      ...bachelorList,
      ...electiveList,
      ...compulsoryList,
    ].map(course => ({
      ...course,
      selectedOccasionIndex: selectedOccasions[course.code] ?? 0
    }));
  }, [bachelorCourses, electiveCourses, compulsoryCourses, selectedOccasions]);

  const handleClick = useCallback(() => {
    setIsLoading(true);

    const allSelectedCourses = getAllSelectedCourses();
    const foundCollisions = getCollisions(allSelectedCourses);

    if (foundCollisions.length > 0) {
      setCollisions(foundCollisions);
      setShowCollisionDialog(true);
      setIsLoading(false);
    } else {
      executeNavigation(allSelectedCourses);
    }
  }, [getAllSelectedCourses, getCollisions, executeNavigation]);

  const handleContinueAnyway = useCallback(() => {
    setShowCollisionDialog(false);
    setIsLoading(true);

    const wildcardedCodes = new Set<string>();
    collisions.forEach(c => {
      // Mark the second course in every pair to be pushed to a wildcard
      wildcardedCodes.add(c.course2.code);
    });

    const coursesWithWildcards = getAllSelectedCourses().map(course => ({
      ...course,
      forceWildcard: wildcardedCodes.has(course.code)
    }));

    executeNavigation(coursesWithWildcards);
  }, [getAllSelectedCourses, executeNavigation, collisions]);

  return (
    <>
      <Button
        className={cn(
          "transition-all group",
          className
        )}
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
            <Translate text={hasCollisions ? "_guide_continue_with_conflicts" : "_guide_continue"} />
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
      
      <GuideCollisionDialog 
        isOpen={showCollisionDialog}
        onOpenChange={setShowCollisionDialog}
        collisions={collisions}
        onContinueAnyway={handleContinueAnyway}
        selectedOccasions={selectedOccasions}
        onOccasionChange={onOccasionChange}
      />
    </>
  );
};

export default ContinueButton;
