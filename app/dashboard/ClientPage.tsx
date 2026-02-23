"use client";

import { mastersAtom } from "../atoms/mastersAtom";
import { coursesAtom } from "../atoms/coursesAtom";
import { useHydrateAtoms } from "jotai/utils";
import ScheduleSync from "./(scheduleSync)";
import { Course, Master } from "./page";
import { FC, useMemo } from "react";
import DndView from "./(dndView)";
import { useSetAtom } from "jotai";
import { userPreferencesAtom } from "../atoms/UserPreferences";

interface ClientPageProps {
  courses: Course[];
  masters: Record<string, Master>;
  program: string;
  startingYear: number;
  programId: number;
}

const ClientPage: FC<ClientPageProps> = ({ courses, masters, program, startingYear, programId }) => {
  const coursesMap = useMemo(
    () =>
      courses.reduce(
        (acc, course) => {
          acc[`${course.code}`] = course;
          return acc;
        },
        {} as Record<string, Course>,
      ),
    [courses],
  );
  const setPreferences = useSetAtom(userPreferencesAtom);
  useMemo(() => {
    setPreferences((prev) => ({
      ...prev,
      program,
      startingYear,
      programId,
    }));
  }, [program, startingYear, programId, setPreferences]);
  
  useHydrateAtoms([
    [coursesAtom, coursesMap],
    [mastersAtom, masters],
  ]);
  return (
    <>
      <ScheduleSync />
      <DndView courses={courses} />
    </>
  );
};

export default ClientPage;
