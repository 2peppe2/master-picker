"use client";

import { useSearchParams } from "@/common/hooks/useSearchParams";
import { scheduleAtoms } from "../../(store)/schedule/atoms";
import { coursesAtom } from "../../(store)/store";
import { useAtomValue, useSetAtom } from "jotai";
import { FC, useEffect, Suspense } from "react";
import {
  readScheduleFromUrlAtom,
  writeScheduleToUrlAtom,
} from "../../(store)/schedule/utils";

const ScheduleSyncInner: FC = () => {
  const { searchParams, setSearchParam } = useSearchParams();

  const schedules = useAtomValue(scheduleAtoms.schedulesAtom);
  const courses = useAtomValue(coursesAtom);

  const readFromUrl = useSetAtom(readScheduleFromUrlAtom);
  const writeToUrl = useSetAtom(writeScheduleToUrlAtom);

  useEffect(() => {
    if (Object.keys(courses).length > 0) {
      readFromUrl({ searchParams });
    }
  }, [courses, searchParams, readFromUrl]);

  useEffect(() => {
    writeToUrl({ searchParams, setSearchParam });
  }, [schedules, searchParams, setSearchParam, writeToUrl]);

  return null;
};

const ScheduleSync: FC = () => (
  <Suspense fallback={null}>
    <ScheduleSyncInner />
  </Suspense>
);

export default ScheduleSync;
