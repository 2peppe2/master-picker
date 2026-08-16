"use client";

import LanguageSwitcher from "@/common/components/translate/LanguageSwitcher";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CompulsorySummaryCard from "@/features/guide/components/CompulsorySummaryCard";
import ElectiveSummaryCard from "@/features/guide/components/ElectiveSummaryCard";
import CompulsorySelector from "@/features/guide/components/CompulsorySelector";
import ElectiveSelector from "@/features/guide/components/ElectiveSelector";
import BackButton from "@/common/components/BackButton";
import type { Course, Master } from "@/common/types";
import { FC, useCallback, useMemo, useState, Suspense } from "react";
import ProgressCard from "@/features/guide/components/ProgressCard";
import GuideHeader from "@/features/guide/components/GuideHeader";
import { Provider as JotaiProvider } from "jotai";
import type { CourseRequirements } from "@/features/guide/types";
import { useHydrateAtoms } from "jotai/utils";
import { mastersAtom } from "@/features/guide/state/store";
import { normalizeCourse } from "@/common/courseNormalizer";

interface GuideClientPageProps {
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
      <div className="relative mx-auto w-full max-w-6xl px-4 pb-56 pt-4 sm:px-6 sm:pb-48 sm:pt-6 lg:px-4 lg:pt-8">
        <div className="mb-10 flex items-start justify-between gap-3">
          <BackButton
            title="Master Picker"
            subtitle="Guide"
            returnText="_dashboard_return_to_landing"
          />
          <LanguageSwitcher />
        </div>
        <GuideHeader selectedMaster={selectedMaster} />

        <div className="grid grid-cols-2 gap-3 pt-6 sm:max-w-2xl sm:gap-4">
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

const GuideClientPage: FC<GuideClientPageProps> = (props) => {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <JotaiProvider>
        <Suspense fallback={null}>
          <GuideContent {...props} />
        </Suspense>
      </JotaiProvider>
    </QueryClientProvider>
  );
};

export default GuideClientPage;
