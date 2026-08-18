"use client";

import { useSearchParams } from "@/common/hooks/useSearchParams";
import { QUERY_PARAM } from "@/common/navigation/queryState";
import { coursesAtom } from "@/features/dashboard/state/catalog-data/atoms";
import {
  hydrateScheduleAtom,
  resetScheduleAtom,
  scheduleGridAtom,
} from "@/features/dashboard/state/schedule/atoms";
import {
  deserializeSchedule,
  serializeSchedule,
} from "@/features/dashboard/state/schedule/utils";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

interface UseScheduleUrlSyncArgs {
  onHydrated?: () => void;
}

interface ScheduleHydrationDecisionArgs {
  courseCount: number;
  scheduleFromUrl: string | null;
  lastWrittenSchedule: string | null | undefined;
}

export const shouldHydrateScheduleFromUrl = ({
  courseCount,
  scheduleFromUrl,
  lastWrittenSchedule,
}: ScheduleHydrationDecisionArgs) =>
  courseCount > 0 && scheduleFromUrl !== lastWrittenSchedule;

export const shouldWriteScheduleToUrl = (
  scheduleFromUrl: string | null,
  serializedSchedule: string | null,
) => scheduleFromUrl !== serializedSchedule;

export const useScheduleUrlSync = ({
  onHydrated,
}: UseScheduleUrlSyncArgs) => {
  const { searchParams, setSearchParam } = useSearchParams();
  const schedules = useAtomValue(scheduleGridAtom);
  const courses = useAtomValue(coursesAtom);
  const hydrateSchedule = useSetAtom(hydrateScheduleAtom);
  const resetSchedule = useSetAtom(resetScheduleAtom);
  const [hydrated, setHydrated] = useState(false);
  const lastWrittenSchedule = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const scheduleFromUrl = searchParams.get(QUERY_PARAM.schedule);
    if (
      shouldHydrateScheduleFromUrl({
        courseCount: Object.keys(courses).length,
        scheduleFromUrl,
        lastWrittenSchedule: lastWrittenSchedule.current,
      })
    ) {
      const grid = deserializeSchedule(courses, scheduleFromUrl);
      if (grid) {
        hydrateSchedule(grid);
      } else if (scheduleFromUrl === null) {
        resetSchedule();
      }
    }

    setHydrated(true);
    onHydrated?.();
  }, [courses, hydrateSchedule, onHydrated, resetSchedule, searchParams]);

  useEffect(() => {
    if (!hydrated) return;

    const timeout = window.setTimeout(() => {
      const serialized = serializeSchedule(courses, schedules);
      lastWrittenSchedule.current = serialized;
      const scheduleFromUrl = searchParams.get(QUERY_PARAM.schedule);
      if (shouldWriteScheduleToUrl(scheduleFromUrl, serialized)) {
        setSearchParam(QUERY_PARAM.schedule, serialized);
      }
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [courses, hydrated, schedules, searchParams, setSearchParam]);
};
