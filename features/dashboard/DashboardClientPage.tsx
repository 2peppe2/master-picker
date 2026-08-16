"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, useCallback, useState, Suspense } from "react";
import { Provider as JotaiProvider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { coursesAtom } from "@/features/dashboard/state/catalog-data/atoms";
import { mastersAtom } from "@/features/catalog/data";
import ScheduleSync from "@/features/dashboard/components/ScheduleSync";
import DashboardView from "@/features/dashboard/components/DashboardView";
import DashboardLoading from "@/features/dashboard/components/DashboardLoading";
import { Course, Master } from "@/common/types";
import { TranslationReadyProvider } from "@/common/components/translate/TranslationReadyContext";

interface ClientPageProps {
  courses: Course[];
  masters: Record<string, Master>;
}

const DashboardContent: FC<ClientPageProps> = ({ courses, masters }) => {
  useHydrateAtoms([
    [
      coursesAtom,
      Object.fromEntries(courses.map((course) => [course.code, course])),
    ],
    [mastersAtom, masters],
  ]);
  const [isReady, setIsReady] = useState(false);
  const markReady = useCallback(() => setIsReady(true), []);

  return (
    <TranslationReadyProvider ready={isReady}>
      <ScheduleSync onHydrated={markReady} />
      {isReady ? <DashboardView /> : <DashboardLoading />}
    </TranslationReadyProvider>
  );
};

const DashboardClientPage: FC<ClientPageProps> = (props) => {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <JotaiProvider>
        <Suspense fallback={null}>
          <DashboardContent {...props} />
        </Suspense>
      </JotaiProvider>
    </QueryClientProvider>
  );
};

export default DashboardClientPage;
