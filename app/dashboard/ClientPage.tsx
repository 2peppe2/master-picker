"use client";

import { useSetAtom } from "jotai";
import { FC } from "react";

import { mastersAtom } from "../atoms/mastersAtom";
import DndView from "./DndView";
import { Course, Master } from "./page";

interface ClientPageProps {
  courses: Course[];
  masters: Record<string, Master>;
}

const ClientPage: FC<ClientPageProps> = ({ courses, masters }) => {
  const setMasters = useSetAtom(mastersAtom);
  setMasters(masters);

  return <DndView courses={courses} />;
};

export default ClientPage;
