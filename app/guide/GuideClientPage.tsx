"use client";

import LanguageSwitcher from "@/common/components/translate/LanguageSwitcher";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CompulsorySummaryCard from "./(components)/CompulsorySummaryCard";
import ElectiveSummaryCard from "./(components)/ElectiveSummaryCard";
import CompulsorySelector from "./(components)/CompulsorySelector";
import ElectiveSelector from "./(components)/ElectiveSelector";
import MasterProvider from "../(store)/MasterAtomContext";
import BackButton from "@/common/components/BackButton";
import type { Course, Master } from "../dashboard/page";
import { FC, useMemo, useState, Suspense } from "react";
import ProgressCard from "./(components)/ProgressCard";
import GuideHeader from "./(components)/GuideHeader";
import { Provider as JotaiProvider } from "jotai";
import type { CourseRequirements } from "./page";
import { useHydrateAtoms } from "jotai/utils";
import { mastersAtom } from "./(store)/store";

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
  useHydrateAtoms([[mastersAtom, masters]], { dangerouslyForceHydrate: true });

  const compulsoryCourses = useMemo(
    () => courseRequirements.filter((req) => req.courses.length === 1),
    [courseRequirements],
  );

  const electiveCourses = useMemo(
    () => courseRequirements.filter((req) => req.courses.length > req.minCount),
    [courseRequirements],
  );

  const [requiredConfirmed, setRequiredConfirmed] = useState(false);
  const [selections, setSelections] = useState<Record<number, Course[]>>({});

  const handleElectiveSelection = (index: number, course: Course) => {
    setSelections((prev) => {
      const currentSelection = prev[index] || [];
      const isAlreadySelected = currentSelection.some(
        (c) => c.code === course.code,
      );
      const nextSelection = isAlreadySelected
        ? currentSelection.filter((c) => c.code !== course.code)
        : [...currentSelection, course];

      return { ...prev, [index]: nextSelection };
    });
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl pb-40 pt-24 px-4 relative">
        <div className="absolute top-8 left-4">
          <BackButton
            title="Master Picker"
            subtitle="Guide"
            returnText="_dashboard_return_to_landing"
          />
        </div>
        <div className="absolute top-8 right-4">
          <LanguageSwitcher />
        </div>
        <GuideHeader selectedMaster={selectedMaster} />

        <div className="grid gap-4 sm:grid-cols-3 pt-4">
          <CompulsorySummaryCard compulsoryCourses={compulsoryCourses} />
          <ElectiveSummaryCard electiveCourses={electiveCourses} />
        </div>

        <CompulsorySelector
          compulsoryCourses={compulsoryCourses}
          compulsoryConfirmed={requiredConfirmed}
          onConfirmChange={() => setRequiredConfirmed((prev) => !prev)}
        />

        {electiveCourses.map((electiveGroup, index) => (
          <ElectiveSelector
            key={`elective-group-${index}`}
            index={index}
            selection={selections[index] || []}
            onSelectionChange={(course) =>
              handleElectiveSelection(index, course)
            }
            electiveCourses={electiveGroup}
          />
        ))}
      </div>

      <ProgressCard
        bachelorCourses={bachelorCourses}
        compulsoryConfirmed={requiredConfirmed}
        compulsoryCourses={compulsoryCourses}
        electiveRequirements={electiveCourses}
        electiveSelections={selections}
      />
    </div>
  );
};

const client = new QueryClient();

const GuideClientPage: FC<GuideClientPageProps> = (props) => (
  <QueryClientProvider client={client}>
    <JotaiProvider>
      <MasterProvider atom={mastersAtom}>
        <Suspense fallback={null}>
          <GuideContent {...props} />
        </Suspense>
      </MasterProvider>
    </JotaiProvider>
  </QueryClientProvider>
);

export default GuideClientPage;
