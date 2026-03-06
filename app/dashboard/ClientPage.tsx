"use client";

import { mastersAtom } from "../atoms/mastersAtom";
import { coursesAtom } from "../atoms/coursesAtom";
import { useHydrateAtoms } from "jotai/utils";
import ScheduleSync from "./(scheduleSync)";
import { Course, Master } from "./page";
import { FC, useMemo } from "react";
import DndView from "./(dndView)";

interface ClientPageProps {
  courses: Course[];
  masters: Record<string, Master>;
}

const ClientPage: FC<ClientPageProps> = ({ courses, masters }) => {
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
