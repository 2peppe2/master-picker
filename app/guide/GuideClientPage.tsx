"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CompulsorySummaryCard from "./(components)/CompulsorySummaryCard";
import ElectiveSummaryCard from "./(components)/ElectiveSummaryCard";
import CompulsorySelector from "./(components)/CompulsorySelector";
import ElectiveSelector from "./(components)/ElectiveSelector";
import type { Course, Master } from "../dashboard/page";
import MasterProvider from "../store/MasterAtomContext";
import ProgressCard from "./(components)/ProgressCard";
import GuideHeader from "./(components)/GuideHeader";
import { Provider as JotaiProvider } from "jotai";
import type { CourseRequirements } from "./page";
import { FC, useMemo, useState } from "react";
import { useHydrateAtoms } from "jotai/utils";
import { mastersAtom } from "./(store)/store";
import { normalizeCourse } from "../courseNormalizer";

interface GuideClientPageProps {
  courseRequirements: CourseRequirements;
  masters: Record<string, Master>;
  selectedMaster: string;
  bachelorCourses: Course[];
}

export interface Conflict {
  courseA: Course;
  courseB: Course;
  semester: string;
  period: number;
  block: number;
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
  const [selectedOccasions, setSelectedOccasions] = useState<Record<string, number>>({});

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

  const conflicts = useMemo(() => {
    const results: Conflict[] = [];
    const compulsoryList = compulsoryCourses
      .flatMap((req) => req.courses)
      .map((c) => normalizeCourse(c.course));
    const electiveList = Object.values(selections).flat();
    const allSelectedCourses = [...electiveList, ...compulsoryList]; // Ignore bachelor courses

    for (let i = 0; i < allSelectedCourses.length; i++) {
      for (let j = i + 1; j < allSelectedCourses.length; j++) {
        const c1 = allSelectedCourses[i];
        const c2 = allSelectedCourses[j];
        
        const occIndex1 = selectedOccasions[c1.code] ?? 0;
        const occIndex2 = selectedOccasions[c2.code] ?? 0;
        
        const occ1 = c1.CourseOccasion?.[occIndex1];
        const occ2 = c2.CourseOccasion?.[occIndex2];

        if (!occ1 || !occ2) continue;
        if (occ1.year !== occ2.year || occ1.semester !== occ2.semester) continue;

        for (const p1 of occ1.periods) {
          for (const p2 of occ2.periods) {
            if (p1.period === p2.period) {
              for (const b1 of p1.blocks) {
                if (p2.blocks.includes(b1)) {
                  results.push({
                    courseA: c1,
                    courseB: c2,
                    semester: occ1.semester,
                    period: p1.period,
                    block: b1,
                  });
                }
              }
            }
          }
        }
      }
    }
    return results;
  }, [selections, compulsoryCourses, selectedOccasions]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl pb-40 pt-24 px-4">
        <GuideHeader selectedMaster={selectedMaster} />

        <div className="grid gap-4 sm:grid-cols-3 pt-4">
          <CompulsorySummaryCard compulsoryCourses={compulsoryCourses} />
          <ElectiveSummaryCard electiveCourses={electiveCourses} />
        </div>

        <CompulsorySelector
          compulsoryCourses={compulsoryCourses}
          compulsoryConfirmed={requiredConfirmed}
          onConfirmChange={() => setRequiredConfirmed((prev) => !prev)}
          conflicts={conflicts}
          selectedOccasions={selectedOccasions}
          onOccasionChange={(code, index) => setSelectedOccasions(prev => ({ ...prev, [code]: index }))}
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
            conflicts={conflicts}
            selectedOccasions={selectedOccasions}
            onOccasionChange={(code, index) => setSelectedOccasions(prev => ({ ...prev, [code]: index }))}
          />
        ))}
      </div>

      <ProgressCard
        bachelorCourses={bachelorCourses}
        compulsoryConfirmed={requiredConfirmed}
        compulsoryCourses={compulsoryCourses}
        electiveRequirements={electiveCourses}
        electiveSelections={selections}
        conflicts={conflicts}
        selectedOccasions={selectedOccasions}
      />
    </div>
  );
};

const client = new QueryClient();

const GuideClientPage: FC<GuideClientPageProps> = (props) => (
  <QueryClientProvider client={client}>
    <JotaiProvider>
      <MasterProvider atom={mastersAtom}>
        <GuideContent {...props} />
      </MasterProvider>
    </JotaiProvider>
  </QueryClientProvider>
);

export default GuideClientPage;
