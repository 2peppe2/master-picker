"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, useMemo, useState, useLayoutEffect } from "react";
import { MasterAtomContext } from "../(store)/MasterAtomContext";
import { Provider as JotaiProvider, useStore } from "jotai";
import { coursesAtom, mastersAtom } from "./(store)/store";
import ScheduleSync from "./(components)/ScheduleSync";
import DndView from "./(components)/DndView";
import { Course, Master } from "./page";

interface ClientPageProps {
  courses: Course[];
  masters: Record<string, Master>;
}

const DashboardContent: FC<ClientPageProps> = ({ courses, masters }) => {
  const [ready, setReady] = useState(false);
  const store = useStore();

  const coursesMap = useMemo(
    () => Object.fromEntries(courses.map((c) => [c.code, c])),
    [courses],
  );

  useLayoutEffect(() => {
    store.set(coursesAtom, coursesMap);
    store.set(mastersAtom, masters);
    setReady(true);
  }, [store, coursesMap, masters]);

  if (!ready) {
    return null;
  }

  return (
    <>
      <ScheduleSync />
      <DndView courses={courses} />
    </>
  );
};

const client = new QueryClient();

const DashboardClientPage: FC<ClientPageProps> = (props) => (
  <QueryClientProvider client={client}>
    <JotaiProvider>
      <MasterAtomContext value={mastersAtom}>
        <DashboardContent {...props} />
      </MasterAtomContext>
    </JotaiProvider>
  </QueryClientProvider>
);

export default DashboardClientPage;
