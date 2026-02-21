"use client";

import type { CourseRequirements } from "./page";
import { mastersAtom } from "../atoms/mastersAtom";
import type { Course, Master } from "../dashboard/page";
import React, { FC, useMemo, useState, useEffect } from "react";
import GuideHeader from "./components/GuideHeader";
import CompulsorySummaryCard from "./components/CompulsorySummaryCard";
import ElectiveSummaryCard from "./components/ElectiveSummaryCard";
import ProgressCard from "./components/ProgressCard";
import CompulsorySelector from "./components/CompulsorySelector";
import ElectiveSelector from "./components/ElectiveSelector";
import { useScheduleMutators } from "../atoms/schedule/hooks/useScheduleMutators";
import ScheduleSync from "../dashboard/(scheduleSync)";
import { useHydrateAtoms } from "jotai/utils";

interface GuideClientPageProps {
  courseRequirements: CourseRequirements;
  masters: Record<string, Master>;
  selectedMaster: string;
  bachelorCourses: Course[];
}

const GuideClientPage: FC<GuideClientPageProps> = ({
  courseRequirements,
  masters,
  selectedMaster,
  bachelorCourses,
}) => {
  useHydrateAtoms([[mastersAtom, masters]]);

  const { addCourseByButton } = useScheduleMutators();

  //TODO: This can moved down to button if we want?
  useEffect(() => {
    bachelorCourses.forEach((course) => {
      addCourseByButton({
        course: course,
        occasion: course.CourseOccasion[0],
      });
    });
  }, [bachelorCourses, addCourseByButton]);

  const compulsoryCourses = useMemo(
    () => courseRequirements.filter((req) => req.courses.length === 1),
    [courseRequirements],
  );

  const electiveCourses = useMemo(
    () => courseRequirements.filter((req) => req.courses.length > 1),
    [courseRequirements],
  );

  const [requiredConfirmed, setRequiredConfirmed] = useState(false);

  const [selections, setSelections] = useState<Record<number, Course>>({});

  const selectedElectiveCourses = useMemo(() => {
    const map: Record<number, Course | null> = {};
    electiveCourses.forEach((_, index) => {
      map[index] = selections[index] ?? null;
    });
    return map;
  }, [electiveCourses, selections]);

  return (
    <>
      <ScheduleSync />
      <div className="min-h-screen ">
        <div className="mx-auto w-full max-w-6xl  pb-40 pt-24">
          <GuideHeader selectedMaster={selectedMaster} />

          <div className="grid gap-4 sm:grid-cols-3 pt-4">
            <CompulsorySummaryCard compulsoryCourses={compulsoryCourses} />
            <ElectiveSummaryCard electiveCourses={electiveCourses} />
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
          compulsoryConfirmed={requiredConfirmed}
          compulsoryCourses={compulsoryCourses}
          electiveCourses={selectedElectiveCourses}
        />
      </div>
    </>
  );
};

export default GuideClientPage;
