"use client";

import LanguageSwitcher from "@/common/components/translate/LanguageSwitcher";
import { useCourseCollisions } from "@/app/dashboard/(store)/schedule/hooks/useCourseCollisions";
import { normalizeCourse } from "@/app/courseNormalizer";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Translate from "@/common/components/translate/Translate";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CompulsorySelector from "./(components)/selectors/CompulsorySelector";
import ElectiveSelector from "./(components)/selectors/ElectiveSelector";
import MasterProvider from "../(store)/MasterAtomContext";
import BackButton from "@/common/components/BackButton";
import type { Course, Master } from "../dashboard/page";
import { FC, useMemo, useState, Suspense } from "react";
import GuideFooter from "./(components)/layout/GuideFooter";
import GuideHeader from "./(components)/layout/GuideHeader";
import GuideSidebar from "./(components)/layout/GuideSidebar";
import CollisionBanner from "./(components)/alerts/CollisionBanner";
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

  const [selections, setSelections] = useState<Record<number, Course[]>>({});
  const [selectedOccasions, setSelectedOccasions] = useState<
    Record<string, number>
  >({});
  const initialTab = compulsoryCourses.length > 0 ? "compulsory" : "elective-0";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

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

  const handleOccasionChange = (courseCode: string, index: number) => {
    setSelectedOccasions((prev) => ({ ...prev, [courseCode]: index }));
  };

  const getCollisions = useCourseCollisions();

  const allSelectedCourses = useMemo(() => {
    const bachelorList = bachelorCourses;
    const electiveList = Object.values(selections).flat();
    const compulsoryList = Object.values(compulsoryCourses)
      .flatMap((req) => req.courses)
      .map((c) => normalizeCourse(c.course));

    return [...bachelorList, ...electiveList, ...compulsoryList].map(
      (course) => ({
        ...course,
        selectedOccasionIndex: selectedOccasions[course.code] ?? 0,
      }),
    );
  }, [bachelorCourses, selections, compulsoryCourses, selectedOccasions]);

  const collisions = useMemo(
    () => getCollisions(allSelectedCourses),
    [allSelectedCourses, getCollisions],
  );

  const overallProgress = useMemo(() => {
    const totalElectives = electiveCourses.length;
    const hasCompulsory = compulsoryCourses.length > 0;
    const completedElectives = electiveCourses.filter((group, index) => {
      const minRequired = group.minCount ?? 1;
      const selectedCount = selections[index]?.length ?? 0;
      return selectedCount >= minRequired;
    }).length;

    const totalSteps = (hasCompulsory ? 1 : 0) + totalElectives;
    const completedSteps = (hasCompulsory ? 1 : 0) + completedElectives;

    return {
      percent: Math.round(
        totalSteps === 0 ? 100 : (completedSteps / totalSteps) * 100,
      ),
      label: `${completedSteps} / ${totalSteps}`,
    };
  }, [electiveCourses, selections, compulsoryCourses]);

  const tabKeys = useMemo(() => {
    const keys = [];
    if (compulsoryCourses.length > 0) keys.push("compulsory");
    electiveCourses.forEach((_, i) => keys.push(`elective-${i}`));
    return keys;
  }, [compulsoryCourses, electiveCourses]);

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
        <div className="bg-card rounded-3xl border shadow-xl flex flex-col overflow-hidden">
          <div className="px-8 pt-12 pb-4 border-b bg-muted/20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <GuideHeader selectedMaster={selectedMaster} />

              <div className="flex flex-col items-end gap-2 mb-1">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="text-muted-foreground">
                    <Translate text="_guide_progress_selection" />
                  </span>
                  <span className="text-emerald-600 tabular-nums font-bold">
                    {overallProgress.percent}%
                  </span>
                </div>
                <div className="h-1.5 w-48 rounded-full bg-muted overflow-hidden border shadow-inner">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-1000 ease-in-out shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                    style={{ width: `${overallProgress.percent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col md:flex-row items-stretch gap-0"
          >
            <div className="w-full md:w-64 bg-muted/40 border-r min-h-full flex flex-col">
              <GuideSidebar
                compulsoryCourses={compulsoryCourses}
                electiveCourses={electiveCourses}
                selections={selections}
                activeTab={activeTab}
              />
            </div>

            <div className="flex-1 w-full min-w-0 flex flex-col bg-card">
              <div className="px-10 pb-10 pt-12">
                {compulsoryCourses.length > 0 && (
                  <TabsContent value="compulsory" className="mt-0 outline-none">
                    <CompulsorySelector
                      compulsoryCourses={compulsoryCourses}
                      selectedOccasions={selectedOccasions}
                      onOccasionChange={handleOccasionChange}
                    />
                  </TabsContent>
                )}
                {electiveCourses.map((electiveGroup, index) => (
                  <TabsContent
                    key={`content-${index}`}
                    value={`elective-${index}`}
                    className="mt-0 outline-none"
                  >
                    <ElectiveSelector
                      index={index}
                      selection={selections[index] || []}
                      selectedOccasions={selectedOccasions}
                      onSelectionChange={(course) =>
                        handleElectiveSelection(index, course)
                      }
                      onOccasionChange={handleOccasionChange}
                      electiveCourses={electiveGroup}
                    />
                  </TabsContent>
                ))}
              </div>

              <CollisionBanner collisions={collisions} />
              <div className="border-t bg-muted/40">
                <GuideFooter
                  bachelorCourses={bachelorCourses}
                  compulsoryCourses={compulsoryCourses}
                  electiveRequirements={electiveCourses}
                  electiveSelections={selections}
                  activeTab={activeTab}
                  selectedOccasions={selectedOccasions}
                  onOccasionChange={handleOccasionChange}
                  hasCollisions={collisions.length > 0}
                  setActiveTab={setActiveTab}
                  tabKeys={tabKeys}
                />
              </div>
            </div>
          </Tabs>
        </div>
      </div>
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
