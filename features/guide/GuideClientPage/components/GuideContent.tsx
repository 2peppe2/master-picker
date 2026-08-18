"use client";

import LanguageSwitcher from "@/common/components/translate/LanguageSwitcher";
import { cn } from "@/lib/utils";
import CompulsorySummaryCard from "@/features/guide/components/CompulsorySummaryCard";
import ElectiveSummaryCard from "@/features/guide/components/ElectiveSummaryCard";
import CompulsorySelector from "@/features/guide/components/CompulsorySelector";
import ElectiveSelector from "@/features/guide/components/ElectiveSelector";
import BackButton from "@/common/components/BackButton";
import type { Course, Master } from "@/common/types";
import { useCallback, useMemo, useState, type FC } from "react";
import ProgressCard from "@/features/guide/components/ProgressCard";
import GuideHeader from "@/features/guide/components/GuideHeader";
import type { CourseRequirements } from "@/features/guide/types";
import { useHydrateAtoms } from "jotai/utils";
import { mastersAtom } from "@/features/guide/state/store";
import { normalizeCourse } from "@/common/courseNormalizer";

export interface GuideClientPageProps {
  courseRequirements: CourseRequirements;
  masters: Record<string, Master>;
  selectedMaster: string;
  bachelorCourses: Course[];
}

const GuideContent: FC<GuideClientPageProps> = ({
  courseRequirements,
  masters,
  selectedMaster,
  bachelorCourses,
}) => {
  useHydrateAtoms([[mastersAtom, masters]]);

  const compulsoryCourses = useMemo(
    () => courseRequirements.filter((req) => req.courses.length === 1),
    [courseRequirements],
  );

  const electiveCourses = useMemo(
    () => courseRequirements.filter((req) => req.courses.length > req.minCount),
    [courseRequirements],
  );

  const [selectionIds, setSelectionIds] = useState<Record<number, string[]>>({});

  const selections = useMemo<Record<number, Course[]>>(
    () => electiveCourses.reduce<Record<number, Course[]>>((result, group, index) => {
      result[index] = group.courses
        .map((entry) => normalizeCourse(entry.course))
        .filter((course) => selectionIds[index]?.includes(course.code));
      return result;
    }, {}),
    [electiveCourses, selectionIds],
  );

  const handleElectiveSelection = useCallback(
    (index: number, selection: string[]) => {
      setSelectionIds((prev) => ({ ...prev, [index]: selection }));
    },
    [],
  );

  return (
    <div className="min-h-screen">
      {/* The bottom padding reserves room for the fixed ProgressCard. sm:pb-48
          is 192px, roughly half a landscape viewport, against a card that
          measures well under that once it is compacted below. */}
      <div
        className={cn(
          "relative mx-auto w-full max-w-6xl px-4 pb-56 pt-4",
          "sm:px-6 sm:pb-48 sm:pt-6 lg:px-4 lg:pt-8",
          "landscape-phone:pb-28 landscape-phone:pt-3",
          "landscape-phone:ps-[calc(1.5rem+env(safe-area-inset-left))]",
          "landscape-phone:pe-[calc(1.5rem+env(safe-area-inset-right))]",
        )}
      >
        <div className="mb-10 flex items-start justify-between gap-3 landscape-phone:mb-4">
          <BackButton
            title="Master Picker"
            subtitle="guide"
            returnText="_dashboard_return_to_landing"
          />
          <LanguageSwitcher />
        </div>
        <GuideHeader selectedMaster={selectedMaster} />

        <div className="grid grid-cols-2 gap-3 pt-6 sm:max-w-2xl sm:gap-4 landscape-phone:pt-3">
          <CompulsorySummaryCard compulsoryCourses={compulsoryCourses} />
          <ElectiveSummaryCard electiveCourses={electiveCourses} />
        </div>

        <CompulsorySelector
          compulsoryCourses={compulsoryCourses}
        />

        {electiveCourses.map((electiveGroup, index) => (
          <ElectiveSelector
            key={`elective-group-${index}`}
            index={index}
            onSelectionChange={handleElectiveSelection}
            selectedCourseIds={selectionIds[index] ?? []}
            electiveCourses={electiveGroup}
          />
        ))}
      </div>

      <ProgressCard
        bachelorCourses={bachelorCourses}
        compulsoryCourses={compulsoryCourses}
        electiveRequirements={electiveCourses}
        electiveSelections={selections}
      />
    </div>
  );
};

export default GuideContent;
