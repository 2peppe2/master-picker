"use client";

import { mastersAtom } from "../atoms/mastersAtom";
import { Course, Master } from "./page";
import { useSetAtom } from "jotai";
import DndView from "./(dndView)";
import { FC } from "react";

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
