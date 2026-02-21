"use client";

import type { CourseRequirements } from "./page";
import { mastersAtom } from "../atoms/mastersAtom";
import type { Master } from "../dashboard/page";
import React, { FC } from "react";
import GuideHeader from "./components/GuideHeader";
import CompulsorySummaryCard from "./components/CompulsorySummaryCard";
import ElectiveSummaryCard from "./components/ElectiveSummaryCard";
import ProgressCard from "./components/ProgressCard";
import CompulsorySelector from "./components/CompulsorySelector";
import ElectiveSelector from "./components/ElectiveSelector";
import { useSetAtom } from "jotai";

interface GuideClientPageProps {
  courseRequirements: CourseRequirements;
  masters: Record<string, Master>;
  selectedMaster: string;
}

const GuideClientPage: FC<GuideClientPageProps> = ({
  courseRequirements,
  masters,
  selectedMaster,
}) => {
  const setMasters = useSetAtom(mastersAtom);
  setMasters(masters);

  const compulsoryCourses = React.useMemo(
    () => courseRequirements.filter((req) => req.courses.length === 1),
    [courseRequirements],
  );
  const electiveCourses = React.useMemo(
    () => courseRequirements.filter((req) => req.courses.length > 1),
    [courseRequirements],
  );
  const [requiredConfirmed, setRequiredConfirmed] = React.useState(false);

  const [selections, setSelections] = React.useState<Record<number, string>>(
    {},
  );

  const selectedElectiveCourses = React.useMemo(() => {
    const map: Record<number, string> = {};
    electiveCourses.forEach((_, index) => {
      map[index] = selections[index] ?? null;
    });
    return map;
  }, [electiveCourses, selections]);

  const completedChoiceGroups = electiveCourses.reduce((count, _, index) => {
    return selectedElectiveCourses[index] ? count + 1 : count;
  }, 0);

  const isChoiceComplete =
    electiveCourses.length === 0 ||
    completedChoiceGroups === electiveCourses.length;

  return (
    <div className="min-h-screen ">
      <div className="mx-auto w-full max-w-6xl  pb-40 pt-24">
        <GuideHeader selectedMaster={selectedMaster} />

        <div className="grid gap-4 sm:grid-cols-3 pt-4">
          <CompulsorySummaryCard compulsoryCourses={compulsoryCourses} />
          <ElectiveSummaryCard
            electiveCourses={electiveCourses}
          />
        </div>
        <CompulsorySelector
          compulsoryCourses={compulsoryCourses}
          compulsoryConfirmed={requiredConfirmed}
          onConfirmChange={() => {
            setRequiredConfirmed((prev) => !prev);
          }}
        />

        {electiveCourses.map((electiveCourses, index) => (
          <ElectiveSelector
            key={index}
            index={index}
            selection={selectedElectiveCourses[index]}
            onSelectionChange={(courseCode) => {
              if (!courseCode) {
                return;
              }
              setSelections((prev) => ({
                ...prev,
                [index]: courseCode,
              }));
            }}
            electiveCourses={electiveCourses}
          />
        ))}
      </div>
      <ProgressCard
        completedChoiceGroups={completedChoiceGroups}
        electiveCourses={electiveCourses}
        isChoiceComplete={isChoiceComplete}
      />
    </div>
  );
};

export default GuideClientPage;
