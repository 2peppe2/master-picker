"use client";

import { coursesAtom } from "@/features/dashboard/state/catalog-data/atoms";
import { mastersAtom } from "@/features/catalog/data";
import ScheduleSync from "@/features/dashboard/components/ScheduleSync";
import DashboardView from "@/features/dashboard/components/DashboardView";
import DashboardLoading from "@/features/dashboard/components/DashboardLoading";
import { TranslationReadyProvider } from "@/common/components/translate/TranslationReadyContext";
import { Course, Master } from "@/common/types";
import { useHydrateAtoms } from "jotai/utils";
import { useCallback, useState, type FC } from "react";

export interface DashboardClientPageProps {
  courses: Course[];
  masters: Record<string, Master>;
}

const DashboardContent: FC<DashboardClientPageProps> = ({
  courses,
  masters,
}) => {
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

export default DashboardContent;
