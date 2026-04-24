"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, useMemo, useState, useLayoutEffect, Suspense } from "react";
import { MasterAtomContext } from "../(store)/MasterAtomContext";
import { Provider as JotaiProvider, useStore } from "jotai";
import { coursesAtom, mastersAtom } from "./(store)/store";
import ScheduleSync from "./(components)/ScheduleSync";
import DashboardView from "./(components)/DashboardView";
import { Course, Master } from "./page";

interface ClientPageProps {
  courses: Course[];
  masters: Record<string, Master>;
}

const DashboardContent: FC<ClientPageProps> = ({ courses, masters }) => {
  const [ready, setReady] = useState(false);
  const store = useStore();

  useLayoutEffect(() => {
    const coursesMap = Object.fromEntries(courses.map((c) => [c.code, c]));
    store.set(coursesAtom, coursesMap);
    store.set(mastersAtom, masters);
    setReady(true);
  }, [store, courses, masters]);

  if (!ready) {
    return null;
  }

  return (
    <>
      <ScheduleSync />
      <DashboardView courses={courses} />
    </>
  );
};

const client = new QueryClient();

const DashboardClientPage: FC<ClientPageProps> = (props) => (
  <QueryClientProvider client={client}>
    <JotaiProvider>
      <MasterAtomContext value={mastersAtom}>
        <Suspense fallback={null}>
          <DashboardContent {...props} />
        </Suspense>
      </MasterAtomContext>
    </JotaiProvider>
  </QueryClientProvider>
);

export default DashboardClientPage;
