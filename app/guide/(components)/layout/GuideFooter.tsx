"use client";

import Translate from "@/common/components/translate/Translate";
import ContinueButton from "../navigation/ContinueButton";
import { Course } from "@/app/dashboard/page";
import { CourseRequirements } from "../../page";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FC, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface GuideFooterProps {
  compulsoryCourses: CourseRequirements;
  electiveRequirements: CourseRequirements;
  bachelorCourses: Course[];
  electiveSelections: Record<number, Course[]>;
  activeTab: string;
  selectedOccasions: Record<string, number>;
  onOccasionChange: (courseCode: string, index: number) => void;
  hasCollisions: boolean;
  setActiveTab: (tab: string) => void;
  tabKeys: string[];
}

const GuideFooter: FC<GuideFooterProps> = ({
  bachelorCourses,
  compulsoryCourses,
  electiveRequirements,
  electiveSelections,
  activeTab,
  selectedOccasions,
  onOccasionChange,
  hasCollisions,
  setActiveTab,
  tabKeys,
}) => {
  const currentIndex = useMemo(() => tabKeys.indexOf(activeTab), [tabKeys, activeTab]);
  const isLastTab = currentIndex === tabKeys.length - 1;
  const isFirstTab = currentIndex === 0;

  const handleNext = () => {
    if (currentIndex < tabKeys.length - 1) {
      setActiveTab(tabKeys[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setActiveTab(tabKeys[currentIndex - 1]);
    }
  };

  const { electiveConfirmed, isComplete, currentStepFulfilled } = useMemo(() => {
    const totalElectives = electiveRequirements.length;
    const completedElectives = electiveRequirements.filter((group, index) => {
      const minRequired = group.minCount ?? 1;
      const selectedCount = electiveSelections[index]?.length ?? 0;
      return selectedCount >= minRequired;
    }).length;

    const currentTabFulfilled = activeTab === "compulsory" 
      ? true 
      : (() => {
          const electiveIndex = parseInt(activeTab.split("-")[1] || "0");
          const group = electiveRequirements[electiveIndex];
          if (!group) return true;
          return (electiveSelections[electiveIndex]?.length ?? 0) >= (group.minCount ?? 1);
        })();

    const electiveConfirmed =
      totalElectives === 0 || completedElectives === totalElectives;

    return {
      electiveConfirmed,
      isComplete: electiveConfirmed,
      currentStepFulfilled: currentTabFulfilled,
    };
  }, [electiveRequirements, electiveSelections, activeTab]);

  return (
    <div className="flex items-center justify-between w-full px-10 py-5">
      <div className="flex-1">
        {/* Progression removed as requested */}
      </div>

      <div className="shrink-0 flex items-center gap-4">
        {!currentStepFulfilled && !isLastTab && (
          <p className="text-xs font-medium text-destructive/80 animate-in fade-in slide-in-from-right-2">
            <Translate text="_guide_selection_incomplete" />
          </p>
        )}

        {!isFirstTab && (
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="h-12 px-10 rounded-xl group transition-all font-semibold border-muted-foreground/20 hover:bg-muted/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <Translate text="_guide_previous_step" />
          </Button>
        )}

        {!isLastTab ? (
          <Button
            size="lg"
            disabled={!currentStepFulfilled}
            onClick={handleNext}
            className={cn(
              "h-12 px-10 rounded-xl font-semibold transition-all group",
              currentStepFulfilled
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-md text-white"
                : "opacity-50 cursor-not-allowed",
            )}
          >
            <Translate text="_guide_next_step" />
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        ) : (
          <ContinueButton
            disabled={!isComplete}
            electiveCourses={electiveSelections}
            selectedOccasions={selectedOccasions}
            onOccasionChange={onOccasionChange}
            hasCollisions={hasCollisions}
            bachelorCourses={bachelorCourses}
            compulsoryCourses={compulsoryCourses}
            className="h-12 px-10 rounded-xl font-semibold shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
          />
        )}
      </div>
    </div>
  );
};

export default GuideFooter;
